// apiService.js

const API_BASE_URL = 'http://localhost:8080';

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
        console.log('Fetched user data:', user);
        console.log(user.profilePicture)
        // Store user data
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('picture', user.profilePicture);
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
  }
};

/**
 * Fetches the profile picture by name and returns it as a Base64 data URL.
 * Also stores it in localStorage.
 * 
 * @param {string} pictureName - The filename (e.g., "avatar5.png")
 * @returns {Promise<string|null>} Base64 image data URL or null on failure
 */
export async function getProfilePicture(pictureName) {
  try {
    const response = await fetch(`http://localhost:8080/api/user/getProfilePicture/${pictureName}`);
    console.log(response)
    if (!response.ok) {
      console.error("Failed to fetch profile picture.");
      return null;
    }

    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.onloadend = () => {
        const base64DataUrl = reader.result;
        localStorage.setItem('profilePicture', base64DataUrl);
        resolve(base64DataUrl);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
}

export async function refreshProfilePicture() {
  try {
    const user = await apiService.get(`/api/user/getUserInfoByToken`);
    if (user && user.profilePicture) {
      localStorage.setItem('picture', user.profilePicture);
      console.log('Profile picture updated:', user.profilePicture);
    }
  } catch (err) {
    console.error('Failed to refresh profile picture:', err);
  }
}

export async function updateProfilePicture(picture) {

  const res = await apiService.post('/api/user/change-profile-picture', { picture });
  refreshProfilePicture();
  return res;
}

export async function uploadProfilePicture(formData) {
  try {
    const response = await fetch('http://localhost:8080/api/user/upload-profile-picture', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}` 
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    // Optional: fetch updated user info or just return response
    const user = await apiService.get('/api/user/getUserInfoByToken');
    if (user?.profilePicture) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('picture', user.profilePicture);
    }

    return user;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}


export default apiService;
