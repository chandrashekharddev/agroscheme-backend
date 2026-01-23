// Base API configuration
const API_BASE_URL = 'http://localhost:8000'; // Change to your Render URL when deployed
const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    
    // Farmer Profile
    GET_PROFILE: '/api/farmers/profile',
    UPDATE_PROFILE: '/api/farmers/profile/update',
    
    // Documents
    UPLOAD_DOCUMENT: '/api/documents/upload',
    GET_DOCUMENTS: '/api/documents',
    PROCESS_WITH_AI: '/api/documents/process',
    
    // Schemes
    GET_SCHEMES: '/api/schemes',
    GET_SCHEME_DETAILS: '/api/schemes/',
    CHECK_ELIGIBILITY: '/api/schemes/check-eligibility',
    APPLY_SCHEME: '/api/schemes/apply',
    
    // Applications
    GET_APPLICATIONS: '/api/applications',
    GET_APPLICATION_STATUS: '/api/applications/status/',
    
    // Admin
    ADMIN_STATS: '/api/admin/stats',
    ADMIN_FARMERS: '/api/admin/farmers',
    ADMIN_SCHEMES: '/api/admin/schemes',
    ADMIN_VERIFICATIONS: '/api/admin/verifications'
};

// API Utility Functions
class AgroSchemeAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Get headers with auth
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // GET request
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            Object.keys(params).forEach(key => 
                url.searchParams.append(key, params[key])
            );

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    // POST request
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    // POST with FormData (for file uploads)
    async postFormData(endpoint, formData) {
        try {
            const headers = { 'Authorization': `Bearer ${this.token}` };
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    // PUT request
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    // DELETE request
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            return this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    // Handle response
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: data.detail || 'An error occurred'
            };
        }
        
        return data;
    }

    // Handle error
    handleError(error) {
        console.error('API Error:', error);
        
        // Show user-friendly error message
        if (error.status === 401) {
            // Unauthorized - redirect to login
            this.redirectToLogin();
        } else if (error.status === 403) {
            showNotification('Access denied. Please contact administrator.', 'error');
        } else if (error.status === 404) {
            showNotification('Resource not found.', 'error');
        } else if (error.status === 500) {
            showNotification('Server error. Please try again later.', 'error');
        } else {
            showNotification(error.message || 'Network error. Please check your connection.', 'error');
        }
        
        throw error;
    }

    // Redirect to login
    redirectToLogin() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('farmerData');
        window.location.href = '/index.html';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('farmerData');
        window.location.href = '/index.html';
    }
}

// Create global API instance
window.api = new AgroSchemeAPI();

// API Service Functions
const AgroSchemeServices = {
    // Authentication Services
    async login(phone, password) {
        const data = await api.post(API_ENDPOINTS.LOGIN, { phone, password });
        if (data.token) {
            api.setToken(data.token);
            localStorage.setItem('farmerData', JSON.stringify(data.farmer));
        }
        return data;
    },

    async register(farmerData) {
        return await api.post(API_ENDPOINTS.REGISTER, farmerData);
    },

    async verifyOtp(phone, otp) {
        const data = await api.post(API_ENDPOINTS.VERIFY_OTP, { phone, otp });
        if (data.token) {
            api.setToken(data.token);
        }
        return data;
    },

    async resendOtp(phone) {
        return await api.post(API_ENDPOINTS.RESEND_OTP, { phone });
    },

    // Farmer Profile Services
    async getProfile() {
        return await api.get(API_ENDPOINTS.GET_PROFILE);
    },

    async updateProfile(profileData) {
        return await api.put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
    },

    // Document Services
    async uploadDocument(documentData, file) {
        const formData = new FormData();
        formData.append('document_type', documentData.document_type);
        formData.append('farmer_id', documentData.farmer_id);
        formData.append('file', file);
        
        return await api.postFormData(API_ENDPOINTS.UPLOAD_DOCUMENT, formData);
    },

    async getDocuments() {
        return await api.get(API_ENDPOINTS.GET_DOCUMENTS);
    },

    async processWithAI(documentId) {
        return await api.post(`${API_ENDPOINTS.PROCESS_WITH_AI}/${documentId}`);
    },

    // Scheme Services
    async getSchemes(filters = {}) {
        return await api.get(API_ENDPOINTS.GET_SCHEMES, filters);
    },

    async getSchemeDetails(schemeId) {
        return await api.get(`${API_ENDPOINTS.GET_SCHEME_DETAILS}${schemeId}`);
    },

    async checkEligibility(schemeId) {
        return await api.get(`${API_ENDPOINTS.CHECK_ELIGIBILITY}/${schemeId}`);
    },

    async applyScheme(schemeId, consent = true) {
        return await api.post(API_ENDPOINTS.APPLY_SCHEME, { 
            scheme_id: schemeId, 
            consent: consent 
        });
    },

    // Application Services
    async getApplications() {
        return await api.get(API_ENDPOINTS.GET_APPLICATIONS);
    },

    async getApplicationStatus(applicationId) {
        return await api.get(`${API_ENDPOINTS.GET_APPLICATION_STATUS}${applicationId}`);
    },

    // Admin Services
    async getAdminStats() {
        return await api.get(API_ENDPOINTS.ADMIN_STATS);
    },

    async getAdminFarmers(page = 1, limit = 10) {
        return await api.get(API_ENDPOINTS.ADMIN_FARMERS, { page, limit });
    },

    async getAdminSchemes() {
        return await api.get(API_ENDPOINTS.ADMIN_SCHEMES);
    },

    async getPendingVerifications() {
        return await api.get(API_ENDPOINTS.ADMIN_VERIFICATIONS);
    },

    async verifyDocument(documentId, status, notes = '') {
        return await api.post(`${API_ENDPOINTS.ADMIN_VERIFICATIONS}/${documentId}/verify`, {
            status,
            notes
        });
    }
};

// Export services globally
window.AgroSchemeServices = AgroSchemeServices;