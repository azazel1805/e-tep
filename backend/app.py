import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json
from prompts import get_reading_matching_prompt, get_speaking_prompt, get_evaluation_prompt

# Load environment variables
load_dotenv()

# Configure Flask app
app = Flask(__name__)
# IMPORTANT: In production, you should restrict the origins.
# For Render, you would set this to your frontend's URL.
CORS(app) 

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# A map to get the correct prompt function
PROMPT_GENERATORS = {
    "reading-matching": get_reading_matching_prompt,
    "speaking-prompt": get_speaking_prompt,
    # Add other types here
}

@app.route('/api/generate', methods=['POST'])
def generate_question():
    data = request.get_json()
    question_type = data.get('type')

    if not question_type or question_type not in PROMPT_GENERATORS:
        return jsonify({"error": "Invalid question type specified"}), 400

    prompt_function = PROMPT_GENERATORS[question_type]
    prompt = prompt_function()

    try:
        response = model.generate_content(prompt)
        # Clean up the response to be valid JSON
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        question_data = json.loads(cleaned_response)
        return jsonify(question_data)

    except Exception as e:
        print(f"Error generating content: {e}")
        # Add retry logic or a fallback question here if needed
        return jsonify({"error": "Failed to generate question from AI model"}), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate_exam():
    user_answers = request.get_json()
    
    if not user_answers:
        return jsonify({"error": "No answers provided"}), 400

    prompt = get_evaluation_prompt(user_answers)

    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        evaluation_data = json.loads(cleaned_response)
        return jsonify(evaluation_data)
    except Exception as e:
        print(f"Error evaluating content: {e}")
        return jsonify({"error": "Failed to evaluate exam from AI model"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Use a different port than the frontend