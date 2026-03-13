import librosa
import numpy as np
from scipy.stats import zscore
import speech_recognition as sr
import os

# Voice emotion mapping based on speech characteristics
# This analyzes: pitch, speaking rate, energy, etc.

def detect_voice_emotion_from_audio(audio_data):
    """
    Analyze audio data for emotional cues.
    Returns detected emotion based on acoustic features.
    """
    try:
        # Extract audio features
        y, sr_val = librosa.load(audio_data, sr=22050)
        
        if len(y) == 0:
            return "neutral", 0.5
        
        # Extract features
        mfcc = librosa.feature.mfcc(y=y, sr=sr_val, n_mfcc=13)
        mfcc_mean = np.mean(mfcc, axis=1)
        
        # Zero crossing rate (indicates energy and voice quality)
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        zcr_mean = np.mean(zcr)
        
        # Spectral centroid (frequency distribution)
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr_val)[0]
        spectral_centroid_mean = np.mean(spectral_centroid)
        
        # RMS Energy (loudness)
        rms = librosa.feature.rms(y=y)[0]
        rms_mean = np.mean(rms)
        
        # Combine features for emotion detection
        confidence = min(1.0, (zcr_mean + rms_mean) / 2)
        
        # Simple heuristic-based emotion detection
        # High energy + high frequency = happy/excited
        # Low energy + low frequency = sad/depressed
        # Variable energy = angry
        
        energy = rms_mean
        frequency = spectral_centroid_mean / 8000  # Normalize
        variance = np.var(zcr)
        
        if energy > 0.15 and frequency > 0.4:
            emotion = "happy"
        elif energy < 0.08 and frequency < 0.3:
            emotion = "sad"
        elif variance > 0.01:
            emotion = "angry"
        elif frequency > 0.6:
            emotion = "surprise"
        else:
            emotion = "neutral"
            
        confidence = min(1.0, max(0.5, energy * 2))
        
        return emotion, confidence
        
    except Exception as e:
        print(f"Voice emotion detection error: {e}")
        return "neutral", 0.5


def detect_voice_emotion_from_text(text):
    """
    Detect emotion from transcribed speech text using keywords.
    Returns emotion and confidence score.
    """
    if not text or not text.strip():
        return "neutral", 0.0

    text_lower = text.lower().strip()

    # Added Tamil keywords for better support
    emotion_keywords = {
        "happy": [
            "happy", "great", "awesome", "excellent", "wonderful", "love", "amazing", "excited", "yay", "lol", "good", "fantastic", "thrilled", "delighted",
            "சந்தோசம்", "மகிழ்ச்சி", "கூர்ந்து", "செம்ம", "மிக அருமை", "பரவசம்"
        ],
        "sad": [
            "sad", "depressed", "down", "terrible", "awful", "hate", "miss", "cry", "sorry", "bad", "unhappy", "miserable", "gloomy", "heartbroken",
            "வெதுவெதுப்பாக", "பிரியமில்லாமல்", "துன்பनाकமான", "வருத்தமாக", "துயரம்", "தின்மை"
        ],
        "angry": [
            "angry", "furious", "mad", "hate", "annoyed", "frustrated", "irritated", "upset", "damn", "stupid", "rage", "fuming", "pissed",
            "கோர்", "பார்வை", "கோபம்", "திரும்ப", "கோபித்த"  
        ],
        "fear": [
            "scared", "afraid", "nervous", "worry", "anxious", "panic", "terrified", "dread", "help", "fear", "frightened", "worried",
            "பயம்", "சந்தேகம்", "அதிர்ச்சி", "அச்சம்", "பயப்பாடு"
        ],
        "surprise": [
            "wow", "amazing", "shocked", "surprising", "unexpected", "incredible", "unbelievable", "astonished", "surprised",
            "அவசரம்", "அதிர்ச்சி", "வியப்பான", "முயற்சி"
        ],
        "disgust": [
            "gross", "disgusting", "yuck", "nasty", "horrible", "terrible", "awful", "disgusted", "repulsive", "sick",
            "அருவருப்பு", "அவந்த", "பயமடையும்", "மிளிர்ச்சி"
        ]
    }

    emotion_scores = {}
    words = text_lower.split()
    total_words = len(words)

    if total_words == 0:
        return "neutral", 0.0

    for emotion, keywords in emotion_keywords.items():
        score = 0
        for word in words:
            for keyword in keywords:
                if keyword in word:
                    score += 1
                    break  # Count each word only once
        emotion_scores[emotion] = score

    max_score = max(emotion_scores.values())

    if max_score == 0:
        # No keywords found; we assume neutral.
        return "neutral", 0.3

    detected_emotion = max(emotion_scores, key=emotion_scores.get)

    # Increase confidence if keywords are clear and frequent.
    normalized_score = max_score / total_words

    # High keyword match => high confidence (target ~99%)
    if normalized_score >= 0.7:
        confidence = 0.99
    else:
        confidence = 0.65 + min(0.34, normalized_score)

    # Cap confidence at 99% to avoid claiming perfect accuracy
    confidence = min(0.99, confidence)

    return detected_emotion, confidence


def record_audio(duration=3, sample_rate=22050):
    """
    Record audio from microphone for duration seconds.
    Returns file path to saved audio.
    """
    try:
        import sounddevice as sd
        import scipy.io.wavfile as wavfile
        
        print(f"Recording for {duration} seconds...")
        audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1)
        sd.wait()
        
        # Save to temporary file
        audio_file = "temp_audio.wav"
        wavfile.write(audio_file, sample_rate, audio)
        
        return audio_file
        
    except ImportError:
        print("sounddevice not available, using speech_recognition fallback")
        return None
    except Exception as e:
        print(f"Audio recording error: {e}")
        return None


def recognize_speech():
    """
    Use Google Speech Recognition to convert speech to text.
    Returns transcribed text.
    """
    recognizer = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            print("Listening...")
            audio = recognizer.listen(source, timeout=5)
        
        text = recognizer.recognize_google(audio)
        return text
        
    except sr.UnknownValueError:
        print("Could not understand audio")
        return ""
    except sr.RequestError as e:
        print(f"Speech recognition error: {e}")
        return ""
    except Exception as e:
        print(f"Error: {e}")
        return ""
