// Authentication Management
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupAuthListeners();
    }

    // Check if user is authenticated
    checkAuthState() {
        const token = localStorage.getItem('authToken');
        const currentPage = window.location.pathname;
        
        // If no token and trying to access protected pages
        if (!token && !currentPage.includes('index.html') && 
            !currentPage.includes('register.html')) {
            window.location.href = 'index.html';
        }
        
        // If token exists and on login page
        if (token && currentPage.includes('index.html')) {
            window.location.href = 'dashboard.html';
        }
    }

    // Setup event listeners
    setupAuthListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // OTP verification
        const verifyOtpBtn = document.querySelector('[onclick="verifyOtp()"]');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', this.handleOtpVerification.bind(this));
        }

        // Logout buttons
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', this.handleLogout.bind(this));
        });
    }

    // Handle login
    async handleLogin(event) {
        event.preventDefault();
        
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember')?.checked;

        try {
            // Show loading
            this.showLoading(true);
            
            const result = await AgroSchemeServices.login(phone, password);
            
            if (result.success) {
                showNotification('Login successful!', 'success');
                
                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedPhone', phone);
                }
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showNotification(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Handle registration
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('regName').value,
            phone: document.getElementById('regPhone').value,
            state: document.getElementById('regState').value,
            district: document.getElementById('regDistrict').value,
            village: document.getElementById('regVillage')?.value || '',
            language: document.getElementById('regLanguage')?.value || 'hi'
        };

        try {
            this.showLoading(true);
            
            const result = await AgroSchemeServices.register(formData);
            
            if (result.success) {
                showNotification('Registration successful! Please verify OTP.', 'success');
                
                // Show OTP modal
                document.getElementById('registerModal').style.display = 'none';
                this.showOtpModal(formData.phone);
            }
        } catch (error) {
            showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Handle OTP verification
    async handleOtpVerification() {
        const phone = document.getElementById('otpPhoneNumber').textContent;
        const otp = Array.from(document.querySelectorAll('.otp-digit'))
            .map(input => input.value)
            .join('');

        if (otp.length !== 6) {
            showNotification('Please enter complete 6-digit OTP', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            const result = await AgroSchemeServices.verifyOtp(phone, otp);
            
            if (result.success) {
                showNotification('OTP verified successfully!', 'success');
                
                // Close modal and redirect
                document.getElementById('otpModal').style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showNotification(error.message || 'OTP verification failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Handle logout
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            api.logout();
            showNotification('Logged out successfully', 'info');
        }
    }

    // Show OTP modal
    showOtpModal(phone) {
        document.getElementById('otpPhoneNumber').textContent = phone;
        document.getElementById('otpModal').style.display = 'flex';
        
        // Start countdown
        this.startOtpCountdown();
        
        // Auto-focus first OTP input
        setTimeout(() => {
            document.querySelector('.otp-digit').focus();
        }, 100);
    }

    // Start OTP countdown
    startOtpCountdown() {
        let time = 30;
        const countdown = document.getElementById('countdown');
        const resendLink = document.querySelector('.otp-resend a');
        
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.5';
        
        const interval = setInterval(() => {
            countdown.textContent = `(${time}s)`;
            time--;
            
            if (time < 0) {
                clearInterval(interval);
                countdown.textContent = '';
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.opacity = '1';
            }
        }, 1000);
    }

    // Resend OTP
    async resendOtp() {
        const phone = document.getElementById('otpPhoneNumber').textContent;
        
        try {
            const result = await AgroSchemeServices.resendOtp(phone);
            
            if (result.success) {
                showNotification('New OTP sent successfully!', 'success');
                this.startOtpCountdown();
            }
        } catch (error) {
            showNotification(error.message || 'Failed to resend OTP', 'error');
        }
    }

    // Show loading state
    showLoading(show) {
        const buttons = document.querySelectorAll('button[type="submit"]');
        
        buttons.forEach(button => {
            if (show) {
                button.setAttribute('data-original-text', button.innerHTML);
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                button.disabled = true;
            } else {
                const originalText = button.getAttribute('data-original-text');
                if (originalText) {
                    button.innerHTML = originalText;
                }
                button.disabled = false;
            }
        });
    }

    // Get current user
    getCurrentUser() {
        const farmerData = localStorage.getItem('farmerData');
        return farmerData ? JSON.parse(farmerData) : null;
    }

    // Update user data
    updateUserData(data) {
        localStorage.setItem('farmerData', JSON.stringify(data));
    }
}

// Initialize auth manager
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Load saved phone if remember me is checked
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedPhone = localStorage.getItem('savedPhone');
        if (savedPhone) {
            const phoneInput = document.getElementById('phone');
            if (phoneInput) {
                phoneInput.value = savedPhone;
                document.getElementById('remember').checked = true;
            }
        }
    }
});

// Export functions for HTML onclick
window.showOtpModal = (phone) => {
    window.authManager.showOtpModal(phone);
};

window.verifyOtp = () => {
    window.authManager.handleOtpVerification();
};

window.resendOtp = () => {
    window.authManager.resendOtp();
};

window.demoLogin = () => {
    document.getElementById('phone').value = '9876543210';
    document.getElementById('password').value = 'demo123';
    showNotification('Demo credentials filled. Click Login to continue.', 'info');
};