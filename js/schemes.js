// Schemes Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initSchemesPage();
});

function initSchemesPage() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter schemes
            const filter = this.dataset.filter;
            filterSchemes(filter);
        });
    });
    
    // Category tabs
    const categoryTabs = document.querySelectorAll('.category');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter by category
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('schemeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchSchemes(this.value);
        });
    }
    
    // Load schemes
    loadSchemes();
}

function loadSchemes() {
    // In real app: API call to load schemes
    // For demo, schemes are already in HTML
    console.log('Schemes loaded');
}

function filterSchemes(filter) {
    const schemeCards = document.querySelectorAll('.scheme-card');
    
    schemeCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const schemeType = card.classList.contains(filter) ? filter : '';
            if (schemeType === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function filterByCategory(category) {
    // Similar to filterSchemes but for categories
    console.log('Filtering by category:', category);
}

function searchSchemes(query) {
    const schemeCards = document.querySelectorAll('.scheme-card');
    const queryLower = query.toLowerCase();
    
    schemeCards.forEach(card => {
        const schemeName = card.querySelector('h3').textContent.toLowerCase();
        const schemeDesc = card.querySelector('.scheme-description').textContent.toLowerCase();
        
        if (schemeName.includes(queryLower) || schemeDesc.includes(queryLower)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showSchemeDetails(schemeId) {
    // Load scheme details
    const schemeDetails = getSchemeDetails(schemeId);
    
    // Update modal content
    document.getElementById('modalSchemeTitle').textContent = schemeDetails.title;
    document.getElementById('modalSchemeDescription').textContent = schemeDetails.description;
    
    // Show modal
    document.getElementById('schemeDetailsModal').style.display = 'flex';
}

function getSchemeDetails(schemeId) {
    // Mock data - in real app, fetch from API
    const schemes = {
        'pmkisan': {
            title: 'PM-KISAN Scheme',
            description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme with 100% funding from Government of India. Income support of ₹6,000 per year is provided to all land holding farmer families.',
            benefits: [
                '₹6,000 per year in three equal installments',
                'Direct transfer to bank account',
                'No middlemen involved',
                'Coverage for all land holding farmers'
            ]
        },
        'insurance': {
            title: 'PMFBY Crop Insurance',
            description: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) provides comprehensive crop insurance against natural calamities, pests, and diseases.',
            benefits: [
                'Premium support from government',
                'Coverage for all food and oilseed crops',
                'Quick claim settlement',
                'Use of technology for assessment'
            ]
        }
    };
    
    return schemes[schemeId] || schemes['pmkisan'];
}

function applyForScheme() {
    const confirmCheckbox = document.getElementById('schemeConfirmation');
    
    if (!confirmCheckbox.checked) {
        showNotification('Please confirm before applying', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('#schemeDetailsModal .btn-primary');
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

function trackApplication(applicationId) {
    showNotification('Opening application tracking...', 'info');
    // In real app: Open tracking page/modal
}

// Export functions
window.showSchemeDetails = showSchemeDetails;
window.applyForScheme = applyForScheme;
window.trackApplication = trackApplication;