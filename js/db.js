// SellerActions - Supabase Database Layer
// All feature requests, votes, comments, auth, and subscriptions are stored in Supabase.
// Setup: Create a free project at https://supabase.com, run the SQL schema,
// then paste your URL and anon key below.

const SUPABASE_URL = 'https://ccbcmxgdzxzgqkszcddk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_We-SacbNSc3O7JfE8g1DGA_ltenJNSK';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjYmNteGdkenh6Z3Frc3pjZGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzM0ODUsImV4cCI6MjA4ODk0OTQ4NX0.hqNNI7mnp5mXsE12F_0MRjWHISx_nhZ_dsZn_STU8go';

const DB_ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

// Initialize Supabase JS client with legacy anon key (required for Auth)
const _supabaseLib = window.supabase;
const supabaseClient = _supabaseLib ? _supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
console.log('Supabase client initialized:', !!supabaseClient);

// ===== AUTH MODULE =====
const Auth = {
  async getSession() {
    if (!supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  },

  async getUser() {
    const session = await this.getSession();
    return session?.user || null;
  },

  async signInWithMagicLink(email, redirectTo) {
    if (!supabaseClient) throw new Error('Supabase not initialized');
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
  },

  onAuthStateChange(callback) {
    if (!supabaseClient) return;
    supabaseClient.auth.onAuthStateChange(callback);
  }
};

// ===== DB HELPER (with auth-aware headers) =====
const db = {
  async headers() {
    const h = {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    // Use authenticated token if available
    try {
      const session = await Auth.getSession();
      h['Authorization'] = `Bearer ${session?.access_token || SUPABASE_KEY}`;
    } catch {
      h['Authorization'] = `Bearer ${SUPABASE_KEY}`;
    }
    return h;
  },

  async query(table, params = '') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers: await this.headers() });
    if (!res.ok) throw new Error(`DB error: ${res.status}`);
    return res.json();
  },

  async insert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST', headers: await this.headers(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB insert error: ${res.status}`);
    return res.json();
  },

  async update(table, id, data) {
    const h = await this.headers();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH', headers: h, body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB update error: ${res.status}`);
    return res.json();
  },

  async delete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE', headers: await this.headers()
    });
    if (!res.ok) throw new Error(`DB delete error: ${res.status}`);
  }
};

// ===== USER DATA HELPERS =====
const UserDB = {
  async getStoreCredentials() {
    const user = await Auth.getUser();
    if (!user) return [];
    return db.query('store_credentials', `user_id=eq.${user.id}&order=created_at.desc`);
  },

  async hasAmazonConnected() {
    const creds = await this.getStoreCredentials();
    return creds.some(c => c.platform === 'amazon' && c.status === 'active');
  },

  async saveStoreCredential(data) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return db.insert('store_credentials', { ...data, user_id: user.id });
  },

  async getSubscriptions() {
    const user = await Auth.getUser();
    if (!user) return [];
    return db.query('user_subscriptions', `user_id=eq.${user.id}&order=created_at.desc`);
  },

  async addSubscription(productSlug, productName) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Not authenticated');
    return db.insert('user_subscriptions', {
      user_id: user.id,
      product_slug: productSlug,
      product_name: productName
    });
  },

  async addSubscriptions(products) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const rows = products.map(p => ({
      user_id: user.id,
      product_slug: p.slug,
      product_name: p.name
    }));
    return db.insert('user_subscriptions', rows);
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

  // Vote on a request (email is optional, collected via prompt)
  async vote(requestId, email) {
    const wasVoted = this.hasVoted(requestId);
    const nowVoted = !wasVoted;
    this.saveLocalVote(requestId, nowVoted);

    if (DB_ENABLED) {
      try {
        if (nowVoted) {
          const voteData = { request_id: requestId, fingerprint: this.getFingerprint() };
          if (email) voteData.email = email;
          try {
            await db.insert('votes', voteData);
          } catch {
            delete voteData.email;
            await db.insert('votes', voteData);
          }
        } else {
          const fp = this.getFingerprint();
          await fetch(`${SUPABASE_URL}/rest/v1/votes?request_id=eq.${requestId}&fingerprint=eq.${fp}`, {
            method: 'DELETE', headers: db.headers()
          });
        }
        const [req] = await db.query('feature_requests', `id=eq.${requestId}`);
        if (req) {
          const delta = nowVoted ? 1 : -1;
          const newCount = Math.max(0, (req.votes || 0) + delta);
          await db.update('feature_requests', requestId, { votes: newCount });
        }
      } catch (e) {
        console.warn('Vote sync failed:', e);
      }
    } else {
      await submitVote(requestId, '');
    }

    return nowVoted;
  },

  // Add a comment (email is optional, collected via prompt)
  async addComment(requestId, author, text, email) {
    const comment = {
      request_id: requestId,
      author: author || 'Anonymous',
      text: text,
      created_at: new Date().toISOString()
    };

    this.saveLocalComment(requestId, comment);

    if (DB_ENABLED) {
      try {
        const insertData = { request_id: requestId, author: comment.author, text: comment.text };
        if (email) insertData.email = email;
        try {
          const [inserted] = await db.insert('comments', insertData);
          return inserted || comment;
        } catch {
          delete insertData.email;
          const [inserted] = await db.insert('comments', insertData);
          return inserted || comment;
        }
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
