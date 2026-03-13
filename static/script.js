// Global variables
let cameraStream = null;
let recognition = null;
let faceEmotion = 'neutral';
let voiceEmotion = 'neutral';
let faceConfidence = 0.5;
let voiceConfidence = 0.5;
let analysisComplete = false;

// Set default language to Tamil (ta-IN), but allow English if needed.
const DEFAULT_RECOGNITION_LANG = 'ta-IN';

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;

    if (currentPage === '/' || currentPage === '/index.html') {
        initHomePage();
    } else if (currentPage === '/detect' || currentPage === '/detect.html') {
        initDetectPage();
    } else if (currentPage === '/result' || currentPage === '/result.html') {
        initResultPage();
    } else if (currentPage === '/foodscan' || currentPage === '/foodscan.html') {
        initFoodScanPage();
    }
});

// Home page initialization
function initHomePage() {
    // Add any home page specific initialization
}

// Detection page initialization
async function initDetectPage() {
    try {
        await initCamera();
        initVoiceRecognition();
        startAnalysis();
    } catch (error) {
        console.error('Error initializing detection:', error);
        showError('Failed to initialize camera or microphone. Please check permissions.');
    }
}

// Initialize camera
async function initCamera() {
    try {
        const video = document.getElementById('camera');
        const status = document.getElementById('faceStatus');

        if (!video) return;

        status.textContent = 'Requesting camera access... (வீடியோ அணுகலைக் கேட்கிறது)';

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false
        });

        video.srcObject = cameraStream;
        status.textContent = 'Camera ready ✅ (கேமரா தயாராக உள்ளது)';
        status.style.color = '#4CAF50';

    } catch (error) {
        console.error('Camera error:', error);
        const status = document.getElementById('faceStatus');
        status.textContent = 'Camera access denied ❌ (கேமரா அணுகல் மறுக்கப்பட்டது)';
        status.style.color = '#f44336';
        throw error;
    }
}

// Initialize voice recognition
function initVoiceRecognition() {
    const status = document.getElementById('voiceStatus');
    const startBtn = document.getElementById('startVoiceBtn');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        status.textContent = 'Speech recognition not supported ❌';
        status.style.color = '#f44336';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    // Use Tamil recognition by default; fall back to English if unavailable.
    try {
        recognition.lang = DEFAULT_RECOGNITION_LANG;
    } catch (e) {
        recognition.lang = 'en-US';
    }

    recognition.onstart = function() {
        status.textContent = 'Listening... 🎤 (விண்ணப்பம் கேட்கிறது)';
        status.style.color = '#2196F3';
        if (startBtn) startBtn.style.display = 'none';
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        const voiceText = document.getElementById('voiceText');
        if (voiceText) {
            voiceText.textContent = finalTranscript || interimTranscript;
        }

        if (finalTranscript.trim()) {
            analyzeVoiceEmotion(finalTranscript.trim());
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        status.textContent = 'Voice recognition error ❌ (குரல் அடையாளத்தில் பிழை)';
        status.style.color = '#f44336';
    };

    recognition.onend = function() {
        status.textContent = 'Voice recognition stopped (குரல் அடையாளம் நிறுத்தப்பட்டது)';
        status.style.color = '#ff9800';
    };

    status.textContent = 'Voice recognition ready ✅ (குரல் அடையாளம் தயார்)';
    status.style.color = '#4CAF50';
}

// Start voice recognition
function startVoiceRecognition() {
    if (recognition) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    }
}

// Analyze voice emotion
async function analyzeVoiceEmotion(text) {
    try {
        const response = await fetch('/detect_voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();
        voiceEmotion = data.emotion;
        voiceConfidence = data.confidence;

        updateVoiceDisplay();

        // Check if we can proceed with final analysis
        checkAnalysisComplete();

    } catch (error) {
        console.error('Voice analysis error:', error);
    }
}

// Start the analysis process
async function startAnalysis() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Start voice recognition
    setTimeout(() => {
        startVoiceRecognition();
        progressText.textContent = 'Starting voice analysis...';
        progressFill.style.width = '25%';
    }, 1000);

    // Start face analysis after a delay
    setTimeout(async () => {
        progressText.textContent = 'Analyzing facial expressions...';
        progressFill.style.width = '50%';
        await analyzeFaceEmotion();
    }, 3000);

    // Continue with more analysis
    setTimeout(() => {
        progressText.textContent = 'Processing emotions...';
        progressFill.style.width = '75%';
    }, 8000);

    // Final processing
    setTimeout(() => {
        progressText.textContent = 'Finalizing results...';
        progressFill.style.width = '100%';
        checkAnalysisComplete();
    }, 10000);
}

// Analyze face emotion
async function analyzeFaceEmotion() {
    try {
        const response = await fetch('/detect_face', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        faceEmotion = data.emotion;
        faceConfidence = data.confidence;

        updateFaceDisplay();

    } catch (error) {
        console.error('Face analysis error:', error);
        faceEmotion = 'neutral';
        faceConfidence = 0.5;
    }
}

// Update face display
function updateFaceDisplay() {
    const faceEmotionDiv = document.getElementById('faceEmotion');
    if (faceEmotionDiv) {
        faceEmotionDiv.textContent = `Face: ${faceEmotion} (${Math.round(faceConfidence * 100)}% confidence)`;
    }
}

// Update voice display
function updateVoiceDisplay() {
    const voiceEmotionDiv = document.getElementById('voiceEmotion');
    if (voiceEmotionDiv) {
        voiceEmotionDiv.textContent = `Voice: ${voiceEmotion} (${Math.round(voiceConfidence * 100)}% confidence)`;
    }
}

// Check if analysis is complete
function checkAnalysisComplete() {
    if (faceEmotion !== 'neutral' || voiceEmotion !== 'neutral') {
        analysisComplete = true;
        showResults();
    }
}

// Show results
function showResults() {
    const resultsDiv = document.getElementById('results');
    const finalEmotionDiv = document.getElementById('finalEmotion');
    const continueBtn = document.getElementById('continueBtn');

    if (resultsDiv) {
        resultsDiv.style.display = 'block';

        // Determine final emotion
        let finalEmotion = faceEmotion;
        if (voiceEmotion !== 'neutral' && voiceConfidence > faceConfidence) {
            finalEmotion = voiceEmotion;
        }

        finalEmotionDiv.textContent = `Final Mood: ${finalEmotion}`;

        if (continueBtn) {
            continueBtn.onclick = function() {
                // Store results in sessionStorage
                sessionStorage.setItem('faceEmotion', faceEmotion);
                sessionStorage.setItem('voiceEmotion', voiceEmotion);
                sessionStorage.setItem('faceConfidence', faceConfidence);
                sessionStorage.setItem('voiceConfidence', voiceConfidence);
                sessionStorage.setItem('finalEmotion', finalEmotion);

                window.location.href = '/result';
            };
        }
    }
}

// Result page initialization
function initResultPage() {
    const faceEmotion = sessionStorage.getItem('faceEmotion') || 'neutral';
    const voiceEmotion = sessionStorage.getItem('voiceEmotion') || 'neutral';
    const faceConfidence = parseFloat(sessionStorage.getItem('faceConfidence') || 0.5);
    const voiceConfidence = parseFloat(sessionStorage.getItem('voiceConfidence') || 0.5);
    const finalEmotion = sessionStorage.getItem('finalEmotion') || 'neutral';

    // Update emotion display
    const emotionDiv = document.getElementById('emotion');
    const emotionTamilDiv = document.getElementById('emotionTamil');
    const emotionLabel = finalEmotion.charAt(0).toUpperCase() + finalEmotion.slice(1);

    if (emotionDiv) {
        emotionDiv.textContent = `Detected Mood: ${emotionLabel}`;
    }

    if (emotionTamilDiv) {
        const tamilMap = {
            happy: 'பூக்சாகமான',
            sad: 'வாடிய',
            angry: 'கோபமான',
            fear: 'பயந்த',
            surprise: 'ஆச்சரியமான',
            disgust: 'அருவருப்பான',
            neutral: 'நியாயமான'
        };
        emotionTamilDiv.textContent = `மூட்டு மனநிலை: ${tamilMap[finalEmotion] || finalEmotion}`;
    }

    // Update confidence meter
    const confidenceFill = document.getElementById('confidenceFill');
    const confidencePercent = document.getElementById('confidencePercent');
    const avgConfidence = (faceConfidence + voiceConfidence) / 2;

    if (confidenceFill) {
        confidenceFill.style.width = `${avgConfidence * 100}%`;
    }
    if (confidencePercent) {
        confidencePercent.textContent = `${Math.round(avgConfidence * 100)}%`;
    }

    // Get food recommendations
    fetch('/final_emotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            face_emotion: faceEmotion,
            voice_emotion: voiceEmotion,
            face_confidence: faceConfidence,
            voice_confidence: voiceConfidence
        })
    })
    .then(response => response.json())
    .then(data => {
        updateFoodRecommendations(data);
    })
    .catch(error => {
        console.error('Error fetching recommendations:', error);
    });
}

// Update food recommendations display
function updateFoodRecommendations(data) {
    const foodsDiv = document.getElementById('foods');
    const howDiv = document.getElementById('how');
    const benefitsDiv = document.getElementById('benefits');

    if (foodsDiv && data.foods) {
        foodsDiv.innerHTML = '';
        data.foods.forEach(food => {
            const foodCard = document.createElement('div');
            foodCard.className = 'food-card';
            foodCard.innerHTML = `
                <div class="food-icon">🥗</div>
                <div class="food-name">${food}</div>
            `;
            foodsDiv.appendChild(foodCard);
        });
    }

    if (howDiv && data.how) {
        howDiv.textContent = data.how;
    }

    if (benefitsDiv && data.benefits) {
        benefitsDiv.textContent = data.benefits;
    }
}

// Food scan page initialization
function initFoodScanPage() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const scanBtn = document.getElementById('scanBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewSection = document.getElementById('previewSection');

    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    if (scanBtn) {
        scanBtn.addEventListener('click', scanFood);
    }
}

// Handle file selection
function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file.');
        return;
    }

    const imagePreview = document.getElementById('imagePreview');
    const previewSection = document.getElementById('previewSection');
    const scanBtn = document.getElementById('scanBtn');

    // Store the file
    window.selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewSection.style.display = 'block';
        scanBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Scan food
function scanFood() {
    const file = window.selectedFile;
    if (!file) {
        showError('No file selected.');
        return;
    }

    const loadingSection = document.getElementById('loadingSection');
    const resultsSection = document.getElementById('resultsSection');
    const errorSection = document.getElementById('errorSection');

    // Show loading
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    // Send to server
    fetch('/food_scan', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadingSection.style.display = 'none';

        if (data.error) {
            showError(data.error);
            return;
        }

        // Update results
        document.getElementById('foodName').textContent = data.food;
        document.getElementById('calories').textContent = `${data.nutrition.calories} kcal`;
        document.getElementById('protein').textContent = `${data.nutrition.protein} g`;
        document.getElementById('carbs').textContent = `${data.nutrition.carbohydrates} g`;
        document.getElementById('fat').textContent = `${data.nutrition.fat} g`;
        document.getElementById('fiber').textContent = `${data.nutrition.fiber || 0} g`;
        document.getElementById('sugar').textContent = `${data.nutrition.sugar || 0} g`;

        resultsSection.style.display = 'block';
    })
    .catch(error => {
        console.error('Scan error:', error);
        loadingSection.style.display = 'none';
        showError('Failed to scan food. Please try again.');
    });
}

// Show error message
function showError(message) {
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');

    if (errorSection && errorMessage) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    if (recognition) {
        recognition.stop();
    }
});