// SellerActions - Supabase Database Layer
// All feature requests, votes, and comments are stored in Supabase.
// Setup: Create a free project at https://supabase.com, run the SQL schema,
// then paste your URL and anon key below.

const SUPABASE_URL = '';   // e.g. 'https://xxxxx.supabase.co'
const SUPABASE_KEY = '';   // your anon/public key

const DB_ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

const db = {
  headers() {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  },

  async query(table, params = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers: this.headers() });
    if (!res.ok) throw new Error(`DB error: ${res.status}`);
    return res.json();
  },

  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST', headers: this.headers(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB insert error: ${res.status}`);
    return res.json();
  },

  async update(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...this.headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB update error: ${res.status}`);
    return res.json();
  },

  async delete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE', headers: this.headers()
    });
    if (!res.ok) throw new Error(`DB delete error: ${res.status}`);
  }
};

// ===== FEATURE REQUESTS =====
const RequestsDB = {
  CACHE_KEY: 'sa_requests_cache',
  VOTES_KEY: 'sa_my_votes',
  COMMENTS_CACHE: 'sa_local_comments',

  getLocalVotes() {
    try { return JSON.parse(localStorage.getItem(this.VOTES_KEY)) || {}; } catch { return {}; }
  },

  saveLocalVote(requestId, voted) {
    const votes = this.getLocalVotes();
    if (voted) votes[requestId] = Date.now();
    else delete votes[requestId];
    localStorage.setItem(this.VOTES_KEY, JSON.stringify(votes));
  },

  hasVoted(requestId) {
    return !!this.getLocalVotes()[requestId];
  },

  getLocalComments() {
    try { return JSON.parse(localStorage.getItem(this.COMMENTS_CACHE)) || {}; } catch { return {}; }
  },

  saveLocalComment(requestId, comment) {
    const all = this.getLocalComments();
    if (!all[requestId]) all[requestId] = [];
    all[requestId].push(comment);
    localStorage.setItem(this.COMMENTS_CACHE, JSON.stringify(all));
  },

  // Fetch all approved requests
  async getAll(sortBy = 'votes') {
    if (!DB_ENABLED) return this.getFallbackData(sortBy);

    try {
      const order = sortBy === 'newest' ? 'created_at.desc' : 'votes.desc';
      const requests = await db.query('feature_requests', `status=neq.pending&order=${order}`);

      const requestIds = requests.map(r => r.id);
      let comments = [];
      if (requestIds.length > 0) {
        comments = await db.query('comments', `request_id=in.(${requestIds.join(',')})&order=created_at.asc`);
      }

      const commentMap = {};
      comments.forEach(c => {
        if (!commentMap[c.request_id]) commentMap[c.request_id] = [];
        commentMap[c.request_id].push(c);
      });

      return requests.map(r => ({
        ...r,
        comments: commentMap[r.id] || [],
        hasVoted: this.hasVoted(r.id)
      }));
    } catch (e) {
      console.warn('Failed to fetch from Supabase, using fallback:', e);
      return this.getFallbackData(sortBy);
    }
  },

  // Vote on a request
  async vote(requestId) {
    const wasVoted = this.hasVoted(requestId);
    const nowVoted = !wasVoted;
    this.saveLocalVote(requestId, nowVoted);

    if (DB_ENABLED) {
      try {
        if (nowVoted) {
          await db.insert('votes', { request_id: requestId, fingerprint: this.getFingerprint() });
        } else {
          const fp = this.getFingerprint();
          await fetch(`${SUPABASE_URL}/rest/v1/votes?request_id=eq.${requestId}&fingerprint=eq.${fp}`, {
            method: 'DELETE', headers: db.headers()
          });
        }
        // Update vote count on the request
        const [req] = await db.query('feature_requests', `id=eq.${requestId}`);
        if (req) {
          const voteRows = await db.query('votes', `request_id=eq.${requestId}&select=id`);
          await db.update('feature_requests', requestId, { votes: voteRows.length });
        }
      } catch (e) {
        console.warn('Vote sync failed:', e);
      }
    } else {
      await submitVote(requestId, '');
    }

    return nowVoted;
  },

  // Add a comment
  async addComment(requestId, author, text) {
    const comment = {
      request_id: requestId,
      author: author || 'Anonymous',
      text: text,
      created_at: new Date().toISOString()
    };

    this.saveLocalComment(requestId, comment);

    if (DB_ENABLED) {
      try {
        const [inserted] = await db.insert('comments', {
          request_id: requestId,
          author: comment.author,
          text: comment.text
        });
        return inserted || comment;
      } catch (e) {
        console.warn('Comment sync failed:', e);
      }
    } else {
      await submitComment(requestId, '', text, author);
    }

    return comment;
  },

  // Submit a new request (goes to pending)
  async submitRequest(title, description, email, platform) {
    if (DB_ENABLED) {
      try {
        await db.insert('feature_requests', {
          title, description, email, platform,
          status: 'pending',
          votes: 0
        });
        return true;
      } catch (e) {
        console.warn('Request submission to DB failed:', e);
      }
    }

    await submitFeatureRequest({ title, description, email, platform });
    return true;
  },

  // Simple browser fingerprint for vote deduplication
  getFingerprint() {
    let fp = localStorage.getItem('sa_fingerprint');
    if (!fp) {
      fp = 'fp_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('sa_fingerprint', fp);
    }
    return fp;
  },

  // Fallback: use hardcoded data + localStorage
  getFallbackData(sortBy) {
    if (typeof FEATURE_REQUESTS === 'undefined') return [];

    const localComments = this.getLocalComments();
    const data = FEATURE_REQUESTS.map(r => {
      const extra = localComments[r.id] || [];
      return {
        ...r,
        comments: [
          ...r.comments.map(c => ({ ...c, created_at: c.date, text: c.text })),
          ...extra
        ],
        votes: r.votes + (this.hasVoted(r.id) ? 1 : 0),
        hasVoted: this.hasVoted(r.id)
      };
    });

    if (sortBy === 'newest') data.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
    else data.sort((a, b) => b.votes - a.votes);

    return data;
  }
};
