import requests
from PIL import Image
import io
import os

# Simple food recognition using a free API or basic image processing
# For a college project, we'll use a mock implementation with common foods

FOOD_DATABASE = {
    "apple": {
        "name": "Apple",
        "calories": 95,
        "protein": 0.5,
        "carbohydrates": 25,
        "fat": 0.3,
        "fiber": 4.4,
        "sugar": 19
    },
    "banana": {
        "name": "Banana",
        "calories": 105,
        "protein": 1.3,
        "carbohydrates": 27,
        "fat": 0.4,
        "fiber": 3.1,
        "sugar": 14
    },
    "orange": {
        "name": "Orange",
        "calories": 62,
        "protein": 1.2,
        "carbohydrates": 15,
        "fat": 0.2,
        "fiber": 3.1,
        "sugar": 12
    },
    "carrot": {
        "name": "Carrot",
        "calories": 41,
        "protein": 0.9,
        "carbohydrates": 10,
        "fat": 0.2,
        "fiber": 2.8,
        "sugar": 4.7
    },
    "broccoli": {
        "name": "Broccoli",
        "calories": 55,
        "protein": 3.7,
        "carbohydrates": 11,
        "fat": 0.6,
        "fiber": 5.1,
        "sugar": 1.7
    },
    "chicken": {
        "name": "Chicken Breast",
        "calories": 165,
        "protein": 31,
        "carbohydrates": 0,
        "fat": 3.6,
        "fiber": 0,
        "sugar": 0
    },
    "rice": {
        "name": "White Rice (cooked)",
        "calories": 130,
        "protein": 2.7,
        "carbohydrates": 28,
        "fat": 0.3,
        "fiber": 0.4,
        "sugar": 0.1
    },
    "bread": {
        "name": "Whole Wheat Bread",
        "calories": 81,
        "protein": 3.6,
        "carbohydrates": 13,
        "fat": 1.0,
        "fiber": 1.9,
        "sugar": 1.4
    }
}

def identify_food_from_image(image_file):
    """
    Mock food identification from image.
    In a real implementation, this would use a ML model or API.
    For demo purposes, returns a random food from the database.
    """
    try:
        # Open and validate image
        image = Image.open(image_file)
        image.verify()  # Verify it's a valid image

        # For demo: return a random food
        # In real implementation, use a food recognition API or model
        import random
        food_key = random.choice(list(FOOD_DATABASE.keys()))
        return FOOD_DATABASE[food_key]

    except Exception as e:
        print(f"Error processing image: {e}")
        # Return default food on error
        return FOOD_DATABASE["apple"]

def get_food_nutrition(food_name):
    """
    Get nutrition information for a food item.
    """
    food_name_lower = food_name.lower()

    # Try exact match first
    if food_name_lower in FOOD_DATABASE:
        return FOOD_DATABASE[food_name_lower]

    # Try partial match
    for key, data in FOOD_DATABASE.items():
        if key in food_name_lower or food_name_lower in key:
            return data

    # Return default if no match
    return FOOD_DATABASE["apple"]