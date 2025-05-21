// apiService.js

const API_BASE_URL = 'https://api.eduwave.eduardlupu.com';

/**
 * API service for handling requests to the backend
 */
const apiService = {
  /**
   * Parse response based on content type
   * @param {Response} response - Fetch Response object
   * @returns {Promise<any>} - Parsed response data
   */
  async parseResponse(response) {
    let clone = response.clone();
    try {
      return await response.json();
    } catch (e) {
      return await clone.text();
    }
  },

  /**
   * Make a request to the API
   * @param {string} endpoint - The API endpoint (without leading slash)
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data or error
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Parse the response based on content type
      const data = await this.parseResponse(response);

      if (!response.ok) {
        // Format error response consistently
        const errorMessage = typeof data === 'object' && data.message 
          ? data.message 
          : typeof data === 'string' && data
            ? data
            : 'An error occurred';
            
        throw {
          status: response.status,
          message: errorMessage,
          data,
        };
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error.status === null) {
        console.error('Network error:', error);
        throw {
          status: 0,
          message: 'Network error. Please check your connection.',
        };
      }
      
      // Re-throw API errors
      throw error;
    }
  },

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} options - Additional fetch options
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * POST form data (multipart/form-data)
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data to send
   * @param {Object} options - Additional fetch options
   */
  postForm(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Let the browser set the correct Content-Type with boundary
      ...options,
    });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} options - Additional fetch options
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },

  /**
   * Auth specific API endpoints
   */
  auth: {
    /**
     * Authenticate user
     * @param {Object} credentials - User credentials (email, password)
     */
    async login(credentials) {
      try {
        const loginResponse = await apiService.post('api/user/authenticate', credentials);
        const token = loginResponse.token;

        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          throw new Error('Something went wrong. Please try again.');
        }

        const user = await apiService.get(`/api/user/getUserInfoByToken`);

        // Store user data
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
        
        return loginResponse;
      } catch (error) {
        console.error('Login error:', error);
        throw Object.assign({}, error, {message: 'Login failed. Please check your credentials.'});
      }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<any>} - Response data
     */
    async register(userData) {
      try {
        const response = await apiService.post('api/user/register', userData);
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Log out user
     */
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.clear();
      // You can add a server call here if needed to invalidate the token
    },

    /**
     * Get current user data
     */
    getCurrentUser() {
      const userJson = localStorage.getItem('user');
      if (!userJson) return null;
      
      try {
        return JSON.parse(userJson);
      } catch (e) {
        // If it's not valid JSON, return the raw value
        return userJson;
      }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    }
  },
  activity: {
    /**
     * Get all activities for a given user ID
     * @param {number} userId - The ID of the user
     * @returns {Promise<Array>} - List of activities
     */
    async getActivitiesByUserId(userId) {
      if (!userId) {
        throw new Error('User ID is required to fetch activities.');
      }
      return apiService.get(`api/activity/${userId}/user`);
    }
  }
};

export default apiService;
