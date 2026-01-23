// Document Upload functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeUploadZones();
    loadUploadedDocuments();
    setupUploadListeners();
    
    // Check document verification status
    checkVerificationStatus();
});

function initializeUploadZones() {
    // Setup drag and drop for all upload zones
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('.file-input');
        
        // Click to upload
        zone.addEventListener('click', function(e) {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
        
        // Drag and drop
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0], this.id);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                handleFileUpload(this.files[0], zone.id);
            }
        });
    });
    
    // Bulk upload zone
    const bulkZone = document.getElementById('bulkUploadZone');
    const bulkInput = document.getElementById('bulkFileInput');
    
    if (bulkZone && bulkInput) {
        bulkZone.addEventListener('click', () => bulkInput.click());
        
        bulkZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            bulkZone.classList.add('dragover');
        });
        
        bulkZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            bulkZone.classList.remove('dragover');
        });
        
        bulkZone.addEventListener('drop', (e) => {
            e.preventDefault();
            bulkZone.classList.remove('dragover');
            handleBulkUpload(e.dataTransfer.files);
        });
        
        bulkInput.addEventListener('change', (e) => {
            handleBulkUpload(e.target.files);
        });
    }
}

async function handleFileUpload(file, zoneId) {
    // Validate file
    if (!validateFile(file)) {
        showNotification('Invalid file. Please upload JPG, PNG, or PDF files under 10MB.', 'error');
        return;
    }
    
    // Determine document type from zone ID
    const docType = getDocTypeFromZone(zoneId);
    
    // Show upload progress
    const uploadZone = document.getElementById(zoneId);
    const originalHTML = uploadZone.innerHTML;
    
    uploadZone.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <p>Uploading ${file.name}...</p>
        <div class="upload-progress-mini">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
    `;
    
    try {
        // Simulate upload progress
        await simulateUploadProgress();
        
        // In real app: Upload to backend
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('docType', docType);
        // formData.append('farmerId', getFarmerId());
        
        // const response = await fetch('/api/upload-document', {
        //     method: 'POST',
        //     body: formData
        // });
        
        // const result = await response.json();
        
        // For demo, simulate success
        const result = {
            success: true,
            documentId: `DOC_${Date.now()}`,
            fileUrl: URL.createObjectURL(file),
            extractedData: simulateAIExtraction(file, docType)
        };
        
        if (result.success) {
            // Update UI
            updateDocumentCard(docType, {
                status: 'uploaded',
                fileName: file.name,
                fileSize: formatFileSize(file.size),
                uploadDate: new Date().toLocaleDateString(),
                documentId: result.documentId
            });
            
            // Add to uploaded documents list
            addToUploadedDocuments({
                id: result.documentId,
                name: getDocDisplayName(docType),
                type: docType,
                fileName: file.name,
                size: file.size,
                status: 'Processing with AI',
                date: new Date().toLocaleString(),
                url: result.fileUrl
            });
            
            showNotification(`${getDocDisplayName(docType)} uploaded successfully!`, 'success');
            
            // Process with AI
            if (shouldProcessWithAI(docType)) {
                processDocumentWithAI(result.documentId, file, docType);
            }
        }
        
    } catch (error) {
        console.error('Upload failed:', error);
        showNotification('Upload failed. Please try again.', 'error');
        uploadZone.innerHTML = originalHTML;
    }
}

async function handleBulkUpload(files) {
    if (files.length === 0) return;
    
    if (files.length > 10) {
        showNotification('Maximum 10 files allowed for bulk upload', 'error');
        return;
    }
    
    // Show progress bar
    const progressBar = document.querySelector('.upload-progress-bar');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressDetails = document.getElementById('progressDetails');
    
    progressBar.style.display = 'block';
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    
    let processedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        processedCount++;
        const percent = Math.round((processedCount / files.length) * 100);
        progressFill.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
        progressDetails.textContent = `Processing ${file.name} (${processedCount}/${files.length})`;
        
        // Upload each file
        const docType = detectDocTypeFromFileName(file.name);
        await simulateUploadProgress();
        
        // Simulate upload success
        addToUploadedDocuments({
            id: `BULK_${Date.now()}_${i}`,
            name: getDocDisplayName(docType),
            type: docType,
            fileName: file.name,
            size: file.size,
            status: 'Queued for AI',
            date: new Date().toLocaleString()
        });
        
        // Small delay between files
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    showNotification(`${files.length} files uploaded successfully! Ready for AI processing.`, 'success');
    
    // Hide progress bar after delay
    setTimeout(() => {
        progressBar.style.display = 'none';
    }, 2000);
}

function processDocumentWithAI(documentId, file, docType) {
    // Show AI processing modal
    const modal = document.getElementById('aiProcessingModal');
    modal.style.display = 'flex';
    
    // Update processing steps
    updateProcessingSteps(documentId, docType);
    
    // Simulate AI processing
    simulateAIProcessing(documentId, file, docType);
}

async function simulateAIProcessing(documentId, file, docType) {
    const extractedData = simulateAIExtraction(file, docType);
    
    // Update UI with extracted data
    updateExtractedDataUI(extractedData, docType);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Complete processing
    completeAIProcessing(documentId, extractedData);
}

function simulateAIExtraction(file, docType) {
    // Simulate different data extraction based on document type
    const mockData = {
        'aadhaar': {
            name: 'Sakshi Deshmukh',
            aadhaarNumber: 'XXXX-XXXX-7890',
            dob: '15-08-1985',
            gender: 'Male',
            address: 'Village: Dindori, Taluka: Dindori, Maharashtra',
            confidence: 0.95
        },
        'land_record': {
            surveyNumber: '123/45',
            area: '5.5 Acres',
            ownerName: 'Sakshi Deshmukh',
            village: 'Dindori',
            taluka: 'Dindori',
            crop: 'Sugarcane, Wheat',
            confidence: 0.88
        },
        'bank_passbook': {
            accountHolder: 'Sakshi Deshmukh',
            accountNumber: 'XXXXXXX1234',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
            branch: 'Nashik Main',
            confidence: 0.92
        }
    };
    
    return mockData[docType] || {
        extracted: 'Data extracted successfully',
        confidence: 0.85
    };
}

function updateExtractedDataUI(data, docType) {
    const container = document.getElementById('extractedData');
    
    if (!container) return;
    
    let html = `
        <h4>Extracted Information (${getDocDisplayName(docType)}):</h4>
        <div class="data-grid">
    `;
    
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'confidence') {
            html += `
                <div class="data-item">
                    <span class="data-label">${formatKey(key)}:</span>
                    <span class="data-value">${value}</span>
                </div>
            `;
        }
    }
    
    html += `
        </div>
        <div class="confidence-score">
            <i class="fas fa-brain"></i>
            AI Confidence: ${(data.confidence * 100).toFixed(1)}%
        </div>
    `;
    
    container.innerHTML = html;
}

function completeAIProcessing(documentId, extractedData) {
    // Update document status
    updateDocumentStatus(documentId, 'Processed with AI');
    
    // Update verification progress
    updateVerificationProgress();
    
    // Show success message
    showNotification('AI processing completed successfully!', 'success');
    
    // Close modal after delay
    setTimeout(() => {
        const modal = document.getElementById('aiProcessingModal');
        modal.style.display = 'none';
        
        // Reset extracted data display
        const container = document.getElementById('extractedData');
        if (container) container.innerHTML = '';
    }, 2000);
}

function updateProcessingSteps(documentId, docType) {
    const steps = document.querySelectorAll('.processing-steps .step');
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function updateDocumentCard(docType, data) {
    const cardId = `${docType}Card`;
    const card = document.getElementById(cardId);
    
    if (!card) return;
    
    const statusElement = card.querySelector('.doc-status');
    if (statusElement) {
        statusElement.innerHTML = `
            <i class="fas fa-check-circle"></i> Uploaded
        `;
        statusElement.className = 'doc-status status-verified';
    }
    
    // Update card body with uploaded info
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
        cardBody.innerHTML += `
            <div class="upload-info">
                <p><strong>File:</strong> ${data.fileName}</p>
                <p><strong>Size:</strong> ${data.fileSize}</p>
                <p><strong>Uploaded:</strong> ${data.uploadDate}</p>
                <p><i class="fas fa-robot"></i> AI Processing in progress...</p>
            </div>
        `;
    }
}

function addToUploadedDocuments(document) {
    const tableBody = document.querySelector('.documents-table .table-body');
    
    if (!tableBody) return;
    
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
        <div class="col-doc">
            <i class="fas fa-file-${getFileIcon(document.type)}"></i>
            <div>
                <strong>${document.name}</strong>
                <small>${document.fileName}</small>
            </div>
        </div>
        <div class="col-status">
            <span class="status-badge status-${getStatusClass(document.status)}">
                ${document.status}
            </span>
        </div>
        <div class="col-date">${document.date}</div>
        <div class="col-size">${formatFileSize(document.size)}</div>
        <div class="col-actions">
            <button class="btn-action" onclick="viewDocument('${document.id}')" title="View">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action" onclick="downloadDocument('${document.id}')" title="Download">
                <i class="fas fa-download"></i>
            </button>
            <button class="btn-action" onclick="deleteDocument('${document.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    tableBody.prepend(row);
}

function loadUploadedDocuments() {
    // In real app: Fetch from API
    const mockDocuments = [
        {
            id: 'DOC_001',
            name: 'Aadhaar Card',
            type: 'aadhaar',
            fileName: 'aadhaar_front.jpg',
            size: 2.5 * 1024 * 1024,
            status: 'Verified',
            date: '15 Dec 2024'
        },
        {
            id: 'DOC_002',
            name: 'PAN Card',
            type: 'pan',
            fileName: 'pan_card.pdf',
            size: 1.8 * 1024 * 1024,
            status: 'Pending',
            date: '14 Dec 2024'
        }
    ];
    
    mockDocuments.forEach(doc => addToUploadedDocuments(doc));
}

function checkVerificationStatus() {
    // In real app: Fetch verification status from API
    setTimeout(() => {
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            const progress = 60; // From API
            progressCircle.setAttribute('data-progress', progress);
            progressCircle.querySelector('span').textContent = `${progress}%`;
            
            // Update circle progress (CSS will handle the conic-gradient)
            progressCircle.style.background = `
                conic-gradient(var(--primary-color) ${progress}%, var(--border-color) 0)
            `;
        }
    }, 1000);
}

function updateVerificationProgress() {
    // Update progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        const currentProgress = parseInt(progressCircle.getAttribute('data-progress') || '0');
        const newProgress = Math.min(currentProgress + 15, 100);
        
        progressCircle.setAttribute('data-progress', newProgress);
        progressCircle.querySelector('span').textContent = `${newProgress}%`;
        progressCircle.style.background = `
            conic-gradient(var(--primary-color) ${newProgress}%, var(--border-color) 0)
        `;
        
        if (newProgress >= 100) {
            showNotification('All documents uploaded! You can now enable Auto Apply.', 'success');
        }
    }
}

// Utility functions
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
        return false;
    }
    
    if (file.size > maxSize) {
        return false;
    }
    
    return true;
}

function getDocTypeFromZone(zoneId) {
    const zoneMap = {
        'aadhaarUpload': 'aadhaar',
        'landUpload': 'land_record',
        'bankUpload': 'bank_passbook',
        'panUpload': 'pan',
        'incomeUpload': 'income_certificate',
        'casteUpload': 'caste_certificate'
    };
    
    return zoneMap[zoneId] || 'other';
}

function detectDocTypeFromFileName(fileName) {
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes('aadhaar') || lowerName.includes('uid')) return 'aadhaar';
    if (lowerName.includes('land') || lowerName.includes('7/12') || lowerName.includes('8a')) return 'land_record';
    if (lowerName.includes('bank') || lowerName.includes('passbook')) return 'bank_passbook';
    if (lowerName.includes('pan')) return 'pan';
    if (lowerName.includes('income')) return 'income_certificate';
    if (lowerName.includes('caste')) return 'caste_certificate';
    
    return 'other';
}

function getDocDisplayName(docType) {
    const names = {
        'aadhaar': 'Aadhaar Card',
        'land_record': 'Land Record',
        'bank_passbook': 'Bank Passbook',
        'pan': 'PAN Card',
        'income_certificate': 'Income Certificate',
        'caste_certificate': 'Caste Certificate'
    };
    
    return names[docType] || 'Document';
}

function getFileIcon(docType) {
    const icons = {
        'aadhaar': 'id-card',
        'land_record': 'map',
        'bank_passbook': 'university',
        'pan': 'credit-card',
        'income_certificate': 'file-invoice-dollar',
        'caste_certificate': 'file-certificate'
    };
    
    return icons[docType] || 'file';
}

function getStatusClass(status) {
    if (status.includes('Verified')) return 'success';
    if (status.includes('Pending') || status.includes('Processing')) return 'warning';
    if (status.includes('Error') || status.includes('Failed')) return 'danger';
    return 'info';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getFarmerId() {
    return localStorage.getItem('farmerId') || 'AGRO123456';
}

function shouldProcessWithAI(docType) {
    // Only process certain document types with AI
    const aiProcessTypes = ['aadhaar', 'land_record', 'bank_passbook', 'pan'];
    return aiProcessTypes.includes(docType);
}

async function simulateUploadProgress() {
    return new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

// Document actions
function viewDocument(documentId) {
    showNotification(`Viewing document ${documentId}`, 'info');
    // In real app: Open document viewer modal
}

function downloadDocument(documentId) {
    showNotification(`Downloading document ${documentId}`, 'info');
    // In real app: Trigger file download
}

function deleteDocument(documentId) {
    if (confirm('Are you sure you want to delete this document?')) {
        // Remove from UI
        const rows = document.querySelectorAll('.table-row');
        rows.forEach(row => {
            if (row.querySelector('.btn-action[onclick*="' + documentId + '"]')) {
                row.remove();
            }
        });
        
        // In real app: Delete from backend
        // fetch(`/api/documents/${documentId}`, { method: 'DELETE' });
        
        showNotification('Document deleted successfully', 'success');
        updateVerificationProgress();
    }
}

function clearAll() {
    if (confirm('Are you sure you want to clear all uploaded documents?')) {
        const tableBody = document.querySelector('.documents-table .table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
        }
        
        // Reset all upload zones
        const uploadZones = document.querySelectorAll('.upload-zone');
        uploadZones.forEach(zone => {
            const originalHTML = zone.closest('.document-card').querySelector('.card-body').innerHTML;
            // Reset to original state (you might want to store original HTML)
        });
        
        showNotification('All documents cleared', 'info');
    }
}

function processWithAI() {
    showNotification('Starting AI processing for all documents...', 'info');
    
    // Show processing modal
    const modal = document.getElementById('aiProcessingModal');
    modal.style.display = 'flex';
    
    // Simulate processing all documents
    setTimeout(() => {
        showNotification('AI processing completed for 5 documents', 'success');
        modal.style.display = 'none';
        
        // Update all document statuses
        const statusBadges = document.querySelectorAll('.status-badge');
        statusBadges.forEach(badge => {
            if (badge.textContent.includes('Processing') || badge.textContent.includes('Queued')) {
                badge.textContent = 'Processed';
                badge.className = 'status-badge status-success';
            }
        });
    }, 5000);
}

function closeProcessingModal() {
    const modal = document.getElementById('aiProcessingModal');
    modal.style.display = 'none';
    
    // Reset processing steps
    const steps = document.querySelectorAll('.processing-steps .step');
    steps.forEach(step => step.classList.remove('active'));
}

// Setup event listeners
function setupUploadListeners() {
    // Process with AI button
    const processBtn = document.querySelector('.bulk-actions .btn-primary');
    if (processBtn) {
        processBtn.addEventListener('click', processWithAI);
    }
}

// Export functions for global access
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.deleteDocument = deleteDocument;
window.clearAll = clearAll;
window.processWithAI = processWithAI;
window.closeProcessingModal = closeProcessingModal;