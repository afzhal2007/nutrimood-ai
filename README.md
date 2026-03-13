# NutriMood AI - Complete Implementation Guide

## Project Overview

NutriMood AI is an advanced emotion detection system that combines **face emotion detection** and **voice emotion analysis** to determine your current mood and provide personalized food recommendations for mood improvement.

### Features

✅ **Real-time Face Emotion Detection** - Computer vision-based emotion recognition
✅ **Voice Emotion Analysis** - Web Speech API and keyword-based sentiment analysis
✅ **Intelligent Mood Combination** - Combines face and voice emotions for accurate mood detection
✅ **Automatic Emotion Detection** - No buttons needed, continuous real-time detection
✅ **Smart Food Recommendations** - 7 mood categories with personalized foods
✅ **Educational Benefits** - Shows how each food helps improve mood
✅ **Food Scanner** - Upload images to get nutrition information
✅ **Modern UI** - Responsive, mobile-friendly design
✅ **Auto-Redirect** - Automatically navigates to results when mood is detected

---

## Installation & Setup

### 1. Initial Setup

```bash
cd "c:\Users\AFZHAL INNOVATION\OneDrive\Desktop\nutrimood-ai"
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Application

```bash
python app.py
```

### 4. Access the Application

Open your browser and go to:
```
http://127.0.0.1:5000
```

---

## Project Structure

```
nutrimood-ai/
├── app.py                    # Main Flask application
├── emotion_model.py          # Face emotion detection module
├── voice_model.py            # Voice emotion detection module
├── food_scanner.py           # Food image analysis module
├── requirements.txt          # Project dependencies
├── templates/
│   ├── index.html           # Home page
│   ├── detect.html          # Emotion detection page
│   ├── result.html          # Results & recommendations page
│   └── foodscan.html        # Food scanner page
├── static/
│   ├── script.js            # Frontend JavaScript (real-time detection)
│   └── style.css            # Styling & responsive design
└── venv_fresh/              # Virtual environment
```

---

## How to Use

1. **Home Page**: Introduction and navigation to different features
2. **Emotion Detection**: Grant camera and microphone permissions
3. **Speak Naturally**: Express yourself while camera captures facial expressions
4. **View Results**: Get personalized food recommendations based on your mood
5. **Food Scanner**: Upload food images to analyze nutrition content

---

## API Endpoints

- `GET /` - Home page
- `GET /detect` - Emotion detection page
- `GET /result` - Results page
- `GET /foodscan` - Food scanner page
- `POST /detect_face` - Face emotion analysis
- `POST /detect_voice` - Voice emotion analysis
- `POST /final_emotion` - Combined emotion analysis and recommendations
- `POST /food_scan` - Food image analysis

---

## Supported Emotions

- Happy 😊
- Sad 😢
- Angry 😠
- Fear 😨
- Surprise 😲
- Disgust 🤢
- Neutral 😐

---

## Food Recommendations by Mood

### Happy
- **Foods**: Fruit Salad, Smoothie, Yogurt Parfait, Avocado Toast
- **Benefits**: Provides essential vitamins and antioxidants

### Sad
- **Foods**: Banana, Dark Chocolate, Nuts, Salmon
- **Benefits**: Contains tryptophan and omega-3 for serotonin boost

### Angry
- **Foods**: Green Tea, Avocado, Blueberries, Sweet Potato
- **Benefits**: Reduces inflammation and cortisol levels

### Fear
- **Foods**: Chamomile Tea, Almonds, Whole Grain Bread, Leafy Greens
- **Benefits**: Supports nervous system health and reduces anxiety

### Surprise
- **Foods**: Mixed Berries, Greek Yogurt, Granola, Herbal Tea
- **Benefits**: Provides antioxidants and probiotics for brain health

### Disgust
- **Foods**: Mint Tea, Ginger, Lemon Water, Fresh Herbs
- **Benefits**: Aids digestion and helps cleanse the system

### Neutral
- **Foods**: Healthy Salad, Vegetables, Whole Grains, Lean Protein
- **Benefits**: Provides essential nutrients for overall health

---

## Browser Compatibility

- **Chrome/Edge** (Recommended) - Full Web Speech API support
- **Firefox** - Limited speech recognition support
- **Safari** - Limited speech recognition support

---

## Technical Details

### Face Emotion Detection
- Uses simplified emotion detection for demo purposes
- In production, would integrate with DeepFace or custom CNN models

### Voice Emotion Detection
- Web Speech API for speech-to-text
- Keyword-based sentiment analysis
- Confidence scoring for emotion detection

### Food Scanner
- Mock implementation with nutrition database
- Supports image upload and analysis
- Returns detailed nutrition information

---

## Development Notes

This project is designed as a college AI project demonstration. The emotion detection uses simplified algorithms suitable for educational purposes. For production deployment, consider:

- Implementing proper ML models for emotion detection
- Adding user authentication and data privacy
- Enhancing the nutrition database
- Adding more sophisticated image recognition for food scanning

---

## Troubleshooting

### Camera/Microphone Issues
- Ensure browser permissions are granted
- Check if camera/microphone are not used by other applications
- Try refreshing the page

### Import Errors
- Ensure all dependencies are installed
- Check Python version compatibility
- Try reinstalling problematic packages

### Performance Issues
- Close other applications using camera/microphone
- Ensure stable internet connection for Web Speech API
- Try using Chrome browser for best compatibility

---

## License

This project is for educational purposes and demonstrates AI concepts for college-level projects.
```
WARNING in app.tensorboard - Failed to load tensorboard with TensorFlow 2.x installed...
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Access the Application

1. Open your browser and go to: **http://localhost:5000**
2. Click on the page to start
3. **Allow camera and microphone permissions** when prompted
4. The system will:
   - Continuously analyze your facial expressions
   - Listen to your voice when you click "Start Listening"
   - Automatically combine both emotions
   - Redirect to results when mood is confidently detected

---

## Feature Details

### 1. Face Emotion Detection

**How it works:**
- Continuous video capture from webcam
- OpenCV Haar Cascade detects faces
- DeepFace analyzes 7 emotions: happy, sad, angry, fear, surprise, disgust, neutral
- Fallback CNN model if DeepFace fails
- Confidence score (0-100%)

**Detected Emotions:**
- 😊 **Happy** - High confidence indicates positive mood
- 😢 **Sad** - Indicates depressive state
- 😠 **Angry** - Shows frustration or irritation
- 😨 **Fear** - Indicates anxiety or worry
- 😮 **Surprise** - Shows unexpected emotion (could be positive or negative)
- 🤢 **Disgust** - Indicates disapproval
- 😐 **Neutral** - No strong emotion detected

### 2. Voice Emotion Detection

**How it works:**
- **Speech Recognition**: Google Speech Recognition API converts your speech to text
- **Keyword Analysis**: Analyzes transcribed text for emotion keywords
- **Audio Feature Analysis**: Analyzes:
  - Zero Crossing Rate (voice quality/energy)
  - Spectral Centroid (frequency distribution)
  - RMS Energy (loudness)
  - MFCC coefficients (voice characteristics)

**Example:**
- Saying "I'm so happy!" → Happy emotion
- "I'm feeling down..." → Sad emotion
- "This is ridiculous!" → Angry emotion

### 3. Mood Combination Logic

The system intelligently combines face and voice emotions:

```
IF voice_confidence > 0.75:
    Use voice emotion (true feelings often revealed through voice)
ELSE IF face_confidence > 0.75:
    Use face emotion
ELSE IF both have similar confidence:
    Check if emotions are compatible
    Use the one with higher confidence
DEFAULT:
    Use whichever has higher confidence
```

**Examples:**
- Face: Happy (0.8) + Voice: Normal (0.2) → **Happy**
- Face: Sad (0.6) + Voice: Sad (0.7) → **Sad**
- Face: Neutral (0.5) + Voice: Angry (0.8) → **Angry**

### 4. Food Recommendations

Each mood has 5 tailored foods + benefits:

#### 😊 Happy
- **Foods**: Fruit Salad, Chocolate, Smoothie, Berries, Yogurt
- **Benefits**: Antioxidants, natural sugars, probiotics, B vitamins
- **Instructions**: Eat slowly to enhance mood

#### 😢 Sad
- **Foods**: Banana, Dark Chocolate, Nuts, Salmon, Avocado
- **Benefits**: Omega-3s, tryptophan, serotonin boosters
- **Instructions**: Focus on foods rich in omega-3s and mood-lifting nutrients

#### 😠 Angry
- **Foods**: Green Tea, Almonds, Dark Leafy Greens, Whole Grains, Lemon Water
- **Benefits**: L-theanine relaxation, magnesium, stress reduction
- **Instructions**: Take deep breaths while consuming calming foods

#### 😨 Fear
- **Foods**: Oats, Chamomile Tea, Pumpkin Seeds, Warm Milk, Honey
- **Benefits**: Warm comfort effect, magnesium, tryptophan
- **Instructions**: Prepare warm beverages for parasympathetic activation

#### 😮 Surprise
- **Foods**: Orange, Strawberries, Watermelon, Coconut Water, Ginger
- **Benefits**: Vitamin C, hydration, energy boost
- **Instructions**: Enjoy refreshing foods to stabilize after shock

#### 🤢 Disgust
- **Foods**: Fresh Vegetables, Green Smoothie, Herbal Tea, Ginger Ale, Mint
- **Benefits**: Digestive aid, detoxification, nausea relief
- **Instructions**: Eat light, fresh foods for sensitive digestive system

#### 😐 Neutral
- **Foods**: Mixed Salad, Whole Grain Bread, Vegetables, Fruits, Lean Protein
- **Benefits**: Balanced nutrition, complete micronutrients
- **Instructions**: Maintain balanced diet for optimal health

---

## API Endpoints

### 1. `/` (GET)
Returns the main page with camera and voice input

### 2. `/api/detect-face` (POST)
Analyzes a single video frame for facial emotion

**Request:**
```json
{
    "frame": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
    "emotion": "happy",
    "confidence": 0.85,
    "face_detected": true
}
```

### 3. `/api/detect-voice` (POST)
Analyzes voice transcript for emotion

**Request:**
```json
{
    "transcript": "I'm so happy today!"
}
```

**Response:**
```json
{
    "emotion": "happy",
    "confidence": 0.75,
    "transcript": "I'm so happy today!"
}
```

### 4. `/api/detect` (POST)
Combines face and voice emotions for final mood

**Request:**
```json
{
    "face_emotion": "happy",
    "face_confidence": 0.85,
    "voice_emotion": "happy",
    "voice_confidence": 0.75,
    "face_detected": true
}
```

**Response:**
```json
{
    "mood": "happy",
    "foods": ["Fruit Salad", "Chocolate", ...],
    "how": "Eat fresh fruits for energy...",
    "benefits": ["Antioxidants boost serotonin", ...],
    "face_emotion": "happy",
    "face_confidence": 0.85,
    "voice_emotion": "happy",
    "voice_confidence": 0.75
}
```

### 5. `/result` (GET)
Shows personalized food recommendations

### 6. `/health` (GET)
Health check endpoint

---

## Troubleshooting

### Issue: "Camera access denied"

**Solution:**
1. Check browser permissions for camera
2. Allow access when prompted
3. Refresh the page
4. Try a different browser (Chrome/Edge/Safari)

### Issue: DeepFace returns only "neutral"

**Fixes Applied:**
- ✅ Save face region to temporary file before analysis
- ✅ Add OpenCV Haar Cascade face detection first
- ✅ Validate minimum face size (50x50 pixels)
- ✅ Implement CNN fallback when DeepFace fails
- ✅ Improved color/format handling

### Issue: Voice recognition not working

**Solutions:**
1. Check microphone permissions
2. Test microphone in system settings
3. Ensure internet connection (Google Speech API needs it)
4. Try another browser

### Issue: No automatic redirect

**Reasons:**
- Face confidence too low (< 0.6): Get closer to camera
- Voice confidence too low (< 0.5): Speak more clearly
- Both are weak: Return to home page and try again

### Issue: Slow detection

**Solutions:**
1. Close unnecessary browser tabs
2. Ensure good lighting for face detection
3. Use a modern browser (Chrome, Edge, Safari)
4. Check internet connection speed

---

## System Requirements

| Component | Requirement |
|-----------|------------|
| **Python** | 3.8 - 3.10 |
| **RAM** | Minimum 4GB |
| **Disk** | 2GB free space |
| **Audio** | Working microphone |
| **Video** | Working webcam (720p+) |
| **Internet** | Required (Google Speech API) |
| **Browser** | Chrome, Edge, Safari, Firefox |

---

## Development Notes

### Key Modifications Made

1. **emotion_model.py**
   - Added proper face detection using Haar Cascade
   - Fixed DeepFace by saving frames to temp files
   - Added CNN fallback model
   - Improved error handling

2. **voice_model.py** (NEW)
   - Implemented audio feature extraction (librosa)
   - Keyword-based voice emotion detection
   - Speech-to-text integration via Google API
   - Confidence scoring

3. **app.py**
   - Separated endpoints for face, voice, and combined detection
   - Intelligent emotion combination algorithm
   - Comprehensive mood database with benefits
   - Proper error handling and logging

4. **Frontend (HTML/CSS/JS)**
   - Real-time face detection with visual feedback
   - Voice recording with indicator
   - Automatic emotion combination display
   - Auto-redirect on confident detection
   - Mobile-responsive design
   - Print-friendly results page

---

## Future Enhancements

- [ ] Multiple face detection in group scenarios
- [ ] Historical mood tracking and trends
- [ ] Personalized food allergies/preferences
- [ ] Integration with nutrition databases
- [ ] Mobile app (React Native/Flutter)
- [ ] Real-time audio feature visualization
- [ ] Advanced ML models (transformer-based)
- [ ] Multi-language support
- [ ] Cloud deployment (AWS/GCP/Azure)
- [ ] User authentication and profiles

---

## License

This project is created for educational purposes.

---

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Verify all dependencies are installed
3. Check browser console for error messages (F12)
4. Ensure camera and microphone permissions are granted

---

## Success Indicators

✅ Application runs without errors  
✅ Camera feed displays properly  
✅ Face detection shows within 2 seconds  
✅ Voice recognition works when clicking "Start Listening"  
✅ Emotions display in real-time cards  
✅ Automatically redirects to results page when mood is detected  
✅ Results page shows all food recommendations and benefits  

**Happy Mood Detection! 🎉**
