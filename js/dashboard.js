// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    loadDashboardData();
    setupEventListeners();
    
    // Check for new notifications
    checkNotifications();
    
    // Auto refresh eligible schemes every 5 minutes
    setInterval(loadEligibleSchemes, 300000);
});

function loadDashboardData() {
    // Load farmer data
    const farmerData = getFarmerData();
    updateDashboardUI(farmerData);
    
    // Load eligible schemes
    loadEligibleSchemes();
    
    // Load recent notifications
    loadNotifications();
    
    // Load application status
    loadApplicationStatus();
}

function getFarmerData() {
    // In real app, fetch from API
    // For demo, use localStorage or mock data
    return {
        name: localStorage.getItem('farmerName') || 'Sakshi Deshmukh',
        farmerId: localStorage.getItem('farmerId') || 'AGRO123456',
        location: localStorage.getItem('location') || 'Nashik, Maharashtra',
        profileComplete: 75,
        pendingDocs: 3,
        eligibleSchemes: 12,
        appliedSchemes: 5,
        potentialBenefits: 125000
    };
}

function updateDashboardUI(data) {
    // Update user info
    document.getElementById('userName').textContent = data.name;
    document.querySelector('.farmer-id').textContent = `ID: ${data.farmerId}`;
    document.querySelector('.user-location').innerHTML = 
        `<i class="fas fa-map-marker-alt"></i> ${data.location}`;
    
    // Update stats
    document.querySelector('.quick-stats').innerHTML = `
        <div class="stat-card stat-primary">
            <div class="stat-icon">
                <i class="fas fa-file-contract"></i>
            </div>
            <div class="stat-info">
                <h3>${data.eligibleSchemes}</h3>
                <p>Eligible Schemes</p>
            </div>
            <a href="schemes.html" class="stat-link">View All</a>
        </div>
        
        <div class="stat-card stat-success">
            <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
                <h3>${data.appliedSchemes}</h3>
                <p>Applied Schemes</p>
            </div>
            <a href="#" class="stat-link">Track Status</a>
        </div>
        
        <div class="stat-card stat-warning">
            <div class="stat-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
                <h3>${data.pendingDocs}</h3>
                <p>Pending Documents</p>
            </div>
            <a href="upload-docs.html" class="stat-link">Upload Now</a>
        </div>
        
        <div class="stat-card stat-info">
            <div class="stat-icon">
                <i class="fas fa-rupee-sign"></i>
            </div>
            <div class="stat-info">
                <h3>₹${data.potentialBenefits.toLocaleString()}</h3>
                <p>Potential Benefits</p>
            </div>
            <a href="#" class="stat-link">Details</a>
        </div>
    `;
}

async function loadEligibleSchemes() {
    try {
        // In real app: fetch from API
        // const response = await fetch('/api/eligible-schemes');
        // const schemes = await response.json();
        
        // Mock data for demo
        const schemes = [
            {
                id: 1,
                name: "PM-KISAN",
                description: "₹6,000/year income support",
                tags: ["Central Govt", "Eligible"],
                icon: "fas fa-water",
                status: "eligible"
            },
            {
                id: 2,
                name: "Solar Pump Subsidy",
                description: "Up to 90% subsidy on solar pumps",
                tags: ["State Govt", "Docs Pending"],
                icon: "fas fa-solar-panel",
                status: "pending"
            },
            {
                id: 3,
                name: "Micro Irrigation",
                description: "55% subsidy on drip irrigation",
                tags: ["Central Govt", "Eligible"],
                icon: "fas fa-tint",
                status: "eligible"
            }
        ];
        
        updateEligibleSchemesUI(schemes);
    } catch (error) {
        console.error('Error loading schemes:', error);
    }
}

function updateEligibleSchemesUI(schemes) {
    const container = document.querySelector('.schemes-list');
    if (!container) return;
    
    container.innerHTML = schemes.map(scheme => `
        <div class="scheme-item ${scheme.status === 'eligible' ? 'scheme-highlight' : ''}">
            <div class="scheme-icon">
                <i class="${scheme.icon}"></i>
            </div>
            <div class="scheme-details">
                <h4>${scheme.name}</h4>
                <p>${scheme.description}</p>
                <div class="scheme-tags">
                    ${scheme.tags.map(tag => `
                        <span class="tag ${tag.includes('Eligible') ? 'tag-success' : tag.includes('Pending') ? 'tag-warning' : ''}">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
            <button class="btn-apply" data-scheme="${scheme.id}" onclick="initiateAutoApply(${scheme.id})">
                ${scheme.status === 'eligible' ? 
                    '<i class="fas fa-rocket"></i> Auto Apply' : 
                    '<i class="fas fa-file-upload"></i> Upload Docs'}
            </button>
        </div>
    `).join('');
}

function initiateAutoApply(schemeId) {
    // Get scheme details
    const scheme = getSchemeDetails(schemeId);
    
    // Show confirmation modal
    const modal = document.getElementById('autoApplyModal');
    const schemeName = document.getElementById('schemeName');
    
    if (schemeName) {
        schemeName.textContent = scheme.name;
    }
    
    modal.style.display = 'flex';
    
    // Populate application preview
    populateApplicationPreview(scheme);
}

function getSchemeDetails(schemeId) {
    // In real app, fetch from API
    return {
        id: schemeId,
        name: "PM-KISAN Scheme",
        requirements: ["Aadhaar", "Land Record", "Bank Details"]
    };
}

function populateApplicationPreview(scheme) {
    const farmerData = getFarmerData();
    
    const previewHTML = `
        <h4>Application Preview:</h4>
        <div class="preview-item">
            <span>Scheme:</span>
            <strong>${scheme.name}</strong>
        </div>
        <div class="preview-item">
            <span>Applicant:</span>
            <strong>${farmerData.name}</strong>
        </div>
        <div class="preview-item">
            <span>Farmer ID:</span>
            <strong>${farmerData.farmerId}</strong>
        </div>
        <div class="preview-item">
            <span>Required Documents:</span>
            <strong>${scheme.requirements.join(', ')}</strong>
        </div>
    `;
    
    const previewContainer = document.querySelector('.application-preview');
    if (previewContainer) {
        previewContainer.innerHTML = previewHTML;
    }
}

async function submitApplication() {
    const confirmTerms = document.getElementById('confirmTerms');
    
    if (!confirmTerms.checked) {
        alert('Please confirm that the information is correct');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.modal-footer .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        // In real app: API call to submit application
        // const response = await fetch('/api/submit-application', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(applicationData)
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Application submitted successfully!', 'success');
        
        // Close modal
        closeModal();
        
        // Refresh dashboard
        loadDashboardData();
        
    } catch (error) {
        console.error('Error submitting application:', error);
        showNotification('Failed to submit application. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function closeModal() {
    const modal = document.getElementById('autoApplyModal');
    modal.style.display = 'none';
    
    // Reset form
    const confirmTerms = document.getElementById('confirmTerms');
    if (confirmTerms) confirmTerms.checked = false;
}

function checkEligibility() {
    // Show loading
    showNotification('Checking eligibility for all schemes...', 'info');
    
    // Simulate eligibility check
    setTimeout(() => {
        showNotification('Found 3 new eligible schemes!', 'success');
        loadEligibleSchemes();
    }, 2000);
}

function loadNotifications() {
    // Mock notifications
    const notifications = [
        {
            id: 1,
            title: "PM-KISAN Scheme",
            message: "You're eligible for ₹6,000 annual benefit",
            time: "Just now",
            type: "important"
        },
        {
            id: 2,
            title: "Document Verified",
            message: "Aadhaar card verification completed",
            time: "2 hours ago",
            type: "success"
        },
        {
            id: 3,
            title: "New Scheme Alert",
            message: "Subsidy on drip irrigation systems announced",
            time: "1 day ago",
            type: "info"
        }
    ];
    
    updateNotificationsUI(notifications);
}

function updateNotificationsUI(notifications) {
    const container = document.querySelector('.notifications-list');
    if (!container) return;
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type === 'important' ? 'notification-important' : ''}">
            <div class="notification-icon">
                <i class="fas fa-${notif.type === 'important' ? 'exclamation-circle' : 
                                    notif.type === 'success' ? 'check-circle' : 'seedling'}"></i>
            </div>
            <div class="notification-content">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
            ${notif.type === 'important' ? 
                '<button class="btn-sm btn-primary">Apply</button>' : 
                '<button class="btn-sm btn-outline">View</button>'}
        </div>
    `).join('');
}

function loadApplicationStatus() {
    // Mock application status
    const applications = [
        {
            scheme: "PM-KISAN Application",
            date: "15 Dec 2024",
            status: "approved"
        },
        {
            scheme: "Seed Subsidy Scheme",
            date: "10 Dec 2024",
            status: "pending"
        },
        {
            scheme: "Crop Insurance",
            date: "5 Dec 2024",
            status: "rejected"
        }
    ];
    
    updateApplicationStatusUI(applications);
}

function updateApplicationStatusUI(applications) {
    const container = document.querySelector('.status-timeline');
    if (!container) return;
    
    container.innerHTML = applications.map(app => `
        <div class="timeline-item status-${app.status}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${app.scheme}</h4>
                <p>${app.status === 'approved' ? 'Submitted' : 
                     app.status === 'pending' ? 'Under review since' : 
                     'Additional documents required'} ${app.date}</p>
                <span class="status-text">
                    ${app.status === 'approved' ? 'Approved' : 
                      app.status === 'pending' ? 'Pending' : 'Action Required'}
                </span>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Auto apply toggle
    const autoApplyToggle = document.getElementById('autoApplyToggle');
    if (autoApplyToggle) {
        autoApplyToggle.addEventListener('change', function() {
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`Auto Apply ${status}`, 'info');
            
            // In real app: Update user preference via API
            // updateAutoApplyPreference(this.checked);
        });
    }
    
    // Notification bell
    const notificationBtn = document.querySelector('.btn-notification');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Show notifications dropdown
            showNotificationsDropdown();
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchSchemes(e.target.value);
        });
    }
    
    // Modal close button
    const modalClose = document.querySelector('.modal .close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('autoApplyModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

function searchSchemes(query) {
    // In real app: API search
    console.log('Searching for:', query);
    
    if (query.length > 2) {
        // Show search results
        showNotification(`Searching for "${query}"...`, 'info');
    }
}

function showNotificationsDropdown() {
    // Create and show notifications dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <h4>Notifications</h4>
            <button class="btn-mark-read">Mark all as read</button>
        </div>
        <div class="dropdown-body">
            <!-- Notifications will be loaded here -->
        </div>
        <div class="dropdown-footer">
            <a href="#">View all notifications</a>
        </div>
    `;
    
    // Position and show dropdown
    // Implementation depends on your layout
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Check for new notifications periodically
function checkNotifications() {
    // In real app: Poll API for new notifications
    setInterval(async () => {
        try {
            // const response = await fetch('/api/notifications/new');
            // const newNotifications = await response.json();
            
            // if (newNotifications.length > 0) {
            //     updateNotificationBadge(newNotifications.length);
            // }
        } catch (error) {
            console.error('Error checking notifications:', error);
        }
    }, 60000); // Check every minute
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.btn-notification .badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function downloadCertificate() {
    // Generate and download certificate
    showNotification('Preparing certificate for download...', 'info');
    
    // Simulate download
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'farmer-certificate.pdf';
        link.click();
        showNotification('Certificate downloaded successfully!', 'success');
    }, 2000);
}

// Initialize dashboard when page loads
window.addEventListener('load', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
    }
});