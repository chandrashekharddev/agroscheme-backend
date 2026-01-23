// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initFormValidation();
    initAnimations();
    initUpload();
    initModals();
    initDashboard();
    
    // Check for success messages
    checkURLParams();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            document.querySelector('.nav-links')?.classList.toggle('active');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar?.classList.toggle('active');
        });
    }
}

// Form Validation
function initFormValidation() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.password-input').querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

// Animations
function initAnimations() {
    // Initialize AOS-like animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// Upload Functionality
function initUpload() {
    // Drag and drop
    const dropZones = document.querySelectorAll('.upload-zone, .bulk-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
    
    // File input change
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileSelect);
    });
}

// Modals
function initModals() {
    // Close modals
    document.querySelectorAll('.modal-close, .modal').forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal-close')) {
                this.closest('.modal').style.display = 'none';
            }
        });
    });
    
    // OTP input auto-focus
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

// Dashboard Functions
function initDashboard() {
    // Auto-apply toggle
    const autoApplyToggle = document.querySelector('.auto-apply-toggle input');
    if (autoApplyToggle) {
        autoApplyToggle.addEventListener('change', function() {
            showNotification(
                this.checked ? 'Auto-apply enabled' : 'Auto-apply disabled',
                this.checked ? 'success' : 'info'
            );
        });
    }
    
    // Apply scheme buttons
    document.querySelectorAll('.btn-apply').forEach(btn => {
        btn.addEventListener('click', function() {
            const schemeName = this.closest('.scheme-item').querySelector('h4').textContent;
            showApplyModal(schemeName);
        });
    });
}

// Event Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    if (!phone || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (phone.length !== 10) {
        showNotification('Please enter a valid 10-digit mobile number', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo, redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    const state = document.getElementById('regState').value;
    const district = document.getElementById('regDistrict').value;
    
    if (!name || !phone || !state || !district) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('Registration successful!', 'success');
        closeRegisterModal();
        
        // Auto login for demo
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFileUpload(files);
    }
}

async function handleFileUpload(files) {
    showAIModal();
    
    // Simulate AI processing
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        updateUploadProgress(progress);
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                hideAIModal();
                showNotification(`${files.length} document(s) processed successfully!`, 'success');
                updateVerificationProgress();
            }, 1000);
        }
    }, 200);
}

// UI Functions
function showOtpModal() {
    const phone = document.getElementById('phone')?.value;
    if (!phone || phone.length !== 10) {
        showNotification('Please enter a valid mobile number first', 'error');
        return;
    }
    
    document.getElementById('otpPhoneNumber').textContent = phone;
    document.getElementById('otpModal').style.display = 'flex';
    
    // Auto-focus first OTP input
    setTimeout(() => {
        document.querySelector('.otp-digit').focus();
    }, 100);
    
    // Start countdown
    startOtpCountdown();
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'flex';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerForm').reset();
}

function showApplyModal(schemeName) {
    document.getElementById('schemeName').textContent = schemeName;
    document.getElementById('applyModal').style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showAIModal() {
    document.getElementById('aiModal').style.display = 'flex';
}

function hideAIModal() {
    document.getElementById('aiModal').style.display = 'none';
}

function updateUploadProgress(percent) {
    const progressBar = document.querySelector('.progress-fill');
    const percentText = document.querySelector('.progress-percent');
    
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }
    
    if (percentText) {
        percentText.textContent = `${percent}%`;
    }
}

function updateVerificationProgress() {
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const current = parseInt(progressCircle.dataset.percent || '0');
        const newPercent = Math.min(current + 20, 100);
        
        progressCircle.dataset.percent = newPercent;
        progressCircle.style.background = `conic-gradient(var(--primary) ${newPercent}%, var(--border) 0)`;
        progressCircle.querySelector('span').textContent = `${newPercent}%`;
    }
}

function startOtpCountdown() {
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

function verifyOtp() {
    const otp = Array.from(document.querySelectorAll('.otp-digit'))
        .map(input => input.value)
        .join('');
    
    if (otp.length !== 6) {
        showNotification('Please enter complete 6-digit OTP', 'error');
        return;
    }
    
    // For demo
    showNotification('OTP verified! Logging in...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function resendOtp() {
    showNotification('New OTP sent to your mobile number', 'info');
    startOtpCountdown();
}

function demoLogin() {
    document.getElementById('phone').value = '9876543210';
    document.getElementById('password').value = 'demo123';
    showNotification('Demo credentials filled. Click Login to continue.', 'info');
}

function checkEligibility() {
    showNotification('Checking for eligible schemes...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Found 3 new eligible schemes!', 'success');
    }, 2000);
}

function downloadCertificate() {
    showNotification('Preparing certificate for download...', 'info');
    
    // Simulate download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'farmer-certificate.pdf';
        link.click();
        showNotification('Certificate downloaded successfully!', 'success');
    }, 1500);
}

function callSupport() {
    showNotification('Calling Kisan Call Center: 1551', 'info');
}

function submitApplication() {
    const confirmCheckbox = document.getElementById('confirmApply');
    if (!confirmCheckbox.checked) {
        showNotification('Please confirm before applying', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('#applyModal .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Application submitted successfully!', 'success');
        closeModal();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                             type === 'error' ? 'exclamation-circle' : 
                             type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            &times;
        </button>
    `;
    
    // Add to page
    const container = document.querySelector('.notification-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.className = 'notification-container';
        document.body.appendChild(newContainer);
        newContainer.appendChild(notification);
    } else {
        container.appendChild(notification);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showNotification('Account created successfully!', 'success');
    }
    
    if (urlParams.get('uploaded') === 'true') {
        showNotification('Documents uploaded successfully!', 'success');
    }
}

// Export functions to global scope
window.showOtpModal = showOtpModal;
window.showRegister = showRegister;
window.closeRegisterModal = closeRegisterModal;
window.demoLogin = demoLogin;
window.verifyOtp = verifyOtp;
window.resendOtp = resendOtp;
window.checkEligibility = checkEligibility;
window.downloadCertificate = downloadCertificate;
window.callSupport = callSupport;
window.submitApplication = submitApplication;
window.closeModal = closeModal;

// Initialize when page loads
window.addEventListener('load', function() {
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        }
        
        .notification {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid #2196F3;
        }
        
        .notification-success {
            border-left-color: #4CAF50;
        }
        
        .notification-error {
            border-left-color: #F44336;
        }
        
        .notification-warning {
            border-left-color: #FFC107;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-icon {
            color: #4CAF50;
        }
        
        .notification-error .notification-icon {
            color: #F44336;
        }
        
        .notification-warning .notification-icon {
            color: #FFC107;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content p {
            margin: 0;
            color: #333;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .notification-close:hover {
            background: #f5f5f5;
        }
        
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
});