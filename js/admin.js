// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
});

function initAdminPanel() {
    // Check admin authentication
    checkAdminAuth();
    
    // Load admin data
    loadAdminData();
    
    // Setup event listeners
    setupAdminListeners();
}

function checkAdminAuth() {
    // In real app: Check admin token/session
    const isAdminPage = window.location.pathname.includes('admin.html');
    if (isAdminPage) {
        // For demo, allow access
        console.log('Admin access granted');
    }
}

function loadAdminData() {
    // Load admin stats, activities, etc.
    console.log('Admin data loaded');
}

function setupAdminListeners() {
    // Add event listeners for admin actions
}

function syncSchemes() {
    showNotification('Syncing schemes from government portals...', 'info');
    
    // Simulate sync process
    setTimeout(() => {
        showNotification('Schemes synced successfully! 3 new schemes found.', 'success');
    }, 3000);
}

function addNewScheme() {
    document.getElementById('addSchemeModal').style.display = 'flex';
}

function processDocuments() {
    showNotification('Processing pending documents...', 'info');
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        showNotification(`Processing... ${progress}%`, 'info');
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showNotification('56 documents processed successfully!', 'success');
            }, 1000);
        }
    }, 300);
}

function generateReport() {
    showNotification('Generating monthly report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'agroscheme-report-' + new Date().toISOString().split('T')[0] + '.pdf';
        link.click();
        showNotification('Report downloaded successfully!', 'success');
    }, 2000);
}

function sendNotification() {
    const message = prompt('Enter notification message for all farmers:');
    if (message) {
        showNotification('Sending notification to 1,254 farmers...', 'info');
        
        setTimeout(() => {
            showNotification('Notification sent successfully!', 'success');
        }, 2000);
    }
}

// Export functions
window.syncSchemes = syncSchemes;
window.addNewScheme = addNewScheme;
window.processDocuments = processDocuments;
window.generateReport = generateReport;
window.sendNotification = sendNotification;