import cv2
import random
import time

def detect_face_emotion():
    """
    Simplified face emotion detection for demo purposes.
    In a real implementation, this would use DeepFace or a CNN model.
    For college project demo, returns random emotions with different probabilities.
    """
    # Simulate capturing frames (without actual processing for demo)
    emotions = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral']

    # Weighted random selection (neutral is most common in real scenarios)
    weights = [0.15, 0.15, 0.15, 0.1, 0.1, 0.05, 0.3]  # happy, sad, angry, surprise, fear, disgust, neutral

    # Select emotion based on weights
    emotion = random.choices(emotions, weights=weights, k=1)[0]

    return emotion