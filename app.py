from flask import Flask, render_template, request, jsonify
from emotion_model import detect_face_emotion
from voice_model import detect_voice_emotion_from_text
from food_scanner import identify_food_from_image, get_food_nutrition
import random

app = Flask(__name__)

# Food recommendations based on emotions
FOOD_RECOMMENDATIONS = {
    "happy": {
        "foods": ["Fruit Salad", "Smoothie", "Yogurt Parfait", "Avocado Toast"],
        "how": "Enjoy these refreshing foods to maintain your positive mood and energy levels.",
        "benefits": "These foods provide essential vitamins and antioxidants that support overall well-being and sustained happiness."
    },
    "sad": {
        "foods": ["Banana", "Dark Chocolate", "Nuts", "Salmon"],
        "how": "Eat one banana in the morning, a small piece of dark chocolate in the afternoon, and include nuts or salmon in your meals.",
        "benefits": "These foods contain tryptophan and omega-3 fatty acids that help increase serotonin levels and improve mood."
    },
    "angry": {
        "foods": ["Green Tea", "Avocado", "Blueberries", "Sweet Potato"],
        "how": "Drink green tea throughout the day and include avocado or blueberries in your breakfast or snacks.",
        "benefits": "These foods help reduce inflammation and cortisol levels, promoting calmness and stress reduction."
    },
    "fear": {
        "foods": ["Chamomile Tea", "Almonds", "Whole Grain Bread", "Leafy Greens"],
        "how": "Sip chamomile tea in the evening and include almonds and leafy greens in your daily meals.",
        "benefits": "These foods support nervous system health and provide magnesium that helps reduce anxiety."
    },
    "surprise": {
        "foods": ["Mixed Berries", "Greek Yogurt", "Granola", "Herbal Tea"],
        "how": "Create a berry yogurt parfait with granola for a delightful and nutritious treat.",
        "benefits": "These foods provide antioxidants and probiotics that support brain health and emotional balance."
    },
    "disgust": {
        "foods": ["Mint Tea", "Ginger", "Lemon Water", "Fresh Herbs"],
        "how": "Drink mint or ginger tea and include fresh herbs in your cooking.",
        "benefits": "These foods aid digestion and help cleanse the system, improving overall comfort."
    },
    "neutral": {
        "foods": ["Healthy Salad", "Vegetables", "Whole Grains", "Lean Protein"],
        "how": "Maintain a balanced diet with plenty of vegetables, whole grains, and lean proteins.",
        "benefits": "These foods provide essential nutrients for overall health and stable energy levels."
    }
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/detect")
def detect_page():
    return render_template("detect.html")

@app.route("/result")
def result():
    return render_template("result.html")

@app.route("/foodscan")
def foodscan():
    return render_template("foodscan.html")

@app.route("/detect_face", methods=["POST"])
def detect_face():
    """API endpoint for face emotion detection"""
    try:
        emotion = detect_face_emotion()
        confidence = random.uniform(0.7, 0.95)  # Mock confidence for demo
        return jsonify({
            "emotion": emotion,
            "confidence": round(confidence, 2)
        })
    except Exception as e:
        return jsonify({
            "emotion": "neutral",
            "confidence": 0.5,
            "error": str(e)
        })

@app.route("/detect_voice", methods=["POST"])
def detect_voice():
    """API endpoint for voice emotion detection"""
    try:
        data = request.get_json()
        text = data.get("text", "")

        emotion, confidence = detect_voice_emotion_from_text(text)

        return jsonify({
            "emotion": emotion,
            "confidence": round(confidence, 2)
        })
    except Exception as e:
        return jsonify({
            "emotion": "neutral",
            "confidence": 0.5,
            "error": str(e)
        })

@app.route("/final_emotion", methods=["POST"])
def final_emotion():
    """API endpoint for emotion fusion and food recommendations"""
    try:
        data = request.get_json()
        face_emotion = data.get("face_emotion", "neutral")
        voice_emotion = data.get("voice_emotion", "neutral")
        face_confidence = data.get("face_confidence", 0.5)
        voice_confidence = data.get("voice_confidence", 0.5)

        # Emotion fusion logic
        if voice_emotion != "neutral" and voice_confidence > 0.6:
            final_emotion = voice_emotion
            confidence = voice_confidence
        elif face_emotion != "neutral" and face_confidence > 0.7:
            final_emotion = face_emotion
            confidence = face_confidence
        else:
            # If both are neutral or low confidence, prefer face if available
            final_emotion = face_emotion if face_emotion != "neutral" else voice_emotion
            confidence = max(face_confidence, voice_confidence)

        # Get food recommendations
        food_data = FOOD_RECOMMENDATIONS.get(final_emotion, FOOD_RECOMMENDATIONS["neutral"])

        return jsonify({
            "emotion": final_emotion,
            "confidence": round(confidence, 2),
            "foods": food_data["foods"],
            "how": food_data["how"],
            "benefits": food_data["benefits"]
        })

    except Exception as e:
        return jsonify({
            "emotion": "neutral",
            "confidence": 0.5,
            "foods": FOOD_RECOMMENDATIONS["neutral"]["foods"],
            "how": FOOD_RECOMMENDATIONS["neutral"]["how"],
            "benefits": FOOD_RECOMMENDATIONS["neutral"]["benefits"],
            "error": str(e)
        })

@app.route("/food_scan", methods=["POST"])
def food_scan():
    """API endpoint for food scanning"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"})

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"})

        # Process the image
        nutrition_data = identify_food_from_image(file)

        return jsonify({
            "food": nutrition_data["name"],
            "nutrition": {
                "calories": nutrition_data["calories"],
                "protein": nutrition_data["protein"],
                "carbohydrates": nutrition_data["carbohydrates"],
                "fat": nutrition_data["fat"],
                "fiber": nutrition_data.get("fiber", 0),
                "sugar": nutrition_data.get("sugar", 0)
            }
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "food": "Unknown",
            "nutrition": {
                "calories": 0,
                "protein": 0,
                "carbohydrates": 0,
                "fat": 0
            }
        })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)