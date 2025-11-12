import api from './apiClient';

// Profile APIs
export const profileApi = {
  // Get user profile
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },

  // Update profile with JSON data
  updateProfile: async (data) => {
    const res = await api.patch('/profile', data);
    return res.data;
  },

  // Upload avatar with optional profile updates
  updateAvatar: async ({ file, name, githubUrl, linkedinUrl }) => {
    const form = new FormData();
    if (file) form.append('avatar', file);
    if (name) form.append('name', name);
    if (githubUrl) form.append('githubUrl', githubUrl);
    if (linkedinUrl) form.append('linkedinUrl', linkedinUrl);

    const res = await api.patch('/profile', form);
    // Add cache buster to avatar URL to force refresh
    const data = res.data;
    const avatarUrl = data?.profile?.avatar || data?.avatar;
    
    if (avatarUrl && typeof avatarUrl === 'string') {
      const ts = Date.now();
      const bustedUrl = `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}t=${ts}`;
      if (data.profile) {
        data.profile.avatar = bustedUrl;
      } else if (data.avatar) {
        data.avatar = bustedUrl;
      }
    }
    return data;
  }
};

// Auth APIs
export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/login', credentials);
    return res.data;
  },

  signup: async (userData) => {
    const res = await api.post('/signup', userData);
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/logout');
    return res.data;
  },

  verifyOtp: async (data) => {
    const res = await api.post('/verify-otp', data);
    return res.data;
  },

  googleLogin: async (data) => {
    const res = await api.post('/google-login', data);
    return res.data;
  },

  googleSignup: async (data) => {
    const res = await api.post('/google-signup', data);
    return res.data;
  }
};

// GitHub/LinkedIn crawl APIs
// export const crawlApi = {
//   getCrawlStatus: async (crawlJobId) => {
//     const res = await api.get(`/crawl/status/${crawlJobId}`);
//     return res.data;
//   },

//   getCrawlData: async () => {
//     const res = await api.get('/crawl/data');
//     return res.data;
//   }
// };

// Portfolio APIs
export const portfolioApi = {
  // Fetch generated portfolio from database
  getPortfolio: async () => {
    const res = await api.get('/portfolio');
    return res.data;
  },
  
  // Check portfolio generation status
  getPortfolioStatus: async () => {
    const res = await api.get('/portfolio/status');
    return res.data;
  },
  
  // Manually trigger portfolio regeneration
  regeneratePortfolio: async () => {
    const res = await api.post('/portfolio/regenerate');
    return res.data;
  },
  
  // Deprecated - kept for backwards compatibility
  generatePortfolio: async () => {
    const res = await api.post('/portfolio/generate');
    return res.data;
  }
};

// Export all APIs
export default {
  profile: profileApi,
  auth: authApi,
  portfolio: portfolioApi,
//   crawl: crawlApi
};