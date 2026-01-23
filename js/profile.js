// Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
});

function initProfilePage() {
    // Tab switching
    const profileTabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            profileTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Load profile data
    loadProfileData();
}

let isEditMode = false;

function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const editBtn = document.querySelector('.btn-outline[onclick="toggleEditMode()"]');
    const formInputs = document.querySelectorAll('form input, form select, form textarea');
    
    if (isEditMode) {
        // Enable editing
        formInputs.forEach(input => {
            if (!input.closest('.verified-input')) {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
            }
        });
        
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        editBtn.classList.add('btn-primary');
        editBtn.classList.remove('btn-outline');
        
        showNotification('Edit mode enabled. Make your changes.', 'info');
    } else {
        // Save changes (in real app: API call)
        formInputs.forEach(input => {
            if (!input.closest('.verified-input')) {
                input.setAttribute('readonly', true);
                input.setAttribute('disabled', true);
            }
        });
        
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
        editBtn.classList.remove('btn-primary');
        editBtn.classList.add('btn-outline');
        
        showNotification('Profile updated successfully!', 'success');
    }
}

function loadProfileData() {
    // In real app: API call to load profile data
    console.log('Profile data loaded');
}

function changeAvatar() {
    showNotification('Avatar change feature coming soon!', 'info');
}

function showChangePassword() {
    document.getElementById('changePasswordModal').style.display = 'flex';
}

function closePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'none';
    document.getElementById('changePasswordForm').reset();
}

function showLoginActivity() {
    showNotification('Login activity feature coming soon!', 'info');
}

function deleteAccount() {
    if (confirm('WARNING: This will permanently delete your account and all data. Are you absolutely sure?')) {
        const confirmation = prompt('Type "DELETE" to confirm:');
        if (confirmation === 'DELETE') {
            showNotification('Account deletion requested...', 'warning');
            
            // In real app: API call to delete account
            setTimeout(() => {
                showNotification('Account deleted. Redirecting to home page...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 3000);
        }
    }
}

// Export functions
window.toggleEditMode = toggleEditMode;
window.changeAvatar = changeAvatar;
window.showChangePassword = showChangePassword;
window.closePasswordModal = closePasswordModal;
window.showLoginActivity = showLoginActivity;
window.deleteAccount = deleteAccount;