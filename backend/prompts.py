def get_reading_matching_prompt():
    return """
    You are an expert exam question designer for a B1 CEFR level English test.
    Generate a complete reading passage of about 250 words on a neutral topic like renewable energy, technology, or culture.
    After the passage, create exactly 3 "matching items" questions. For each question, the user must match a piece of information to the correct paragraph (A, B, C, D, or E).
    
    Return the entire output as a single, valid JSON object with the following structure:
    {
      "type": "reading-matching",
      "level": "B1",
      "passage": [
        {"paragraph": "A", "content": "Text for paragraph A..."},
        {"paragraph": "B", "content": "Text for paragraph B..."},
        {"paragraph": "C", "content": "Text for paragraph C..."},
        {"paragraph": "D", "content": "Text for paragraph D..."},
        {"paragraph": "E", "content": "Text for paragraph E..."}
      ],
      "questions": [
        {"id": 1, "statement": "Information to be found in one paragraph...", "correct_paragraph": "E"},
        {"id": 2, "statement": "Another piece of information...", "correct_paragraph": "A"},
        {"id": 3, "statement": "A final piece of information...", "correct_paragraph": "C"}
      ]
    }
    Ensure the JSON is well-formed.
    """

def get_speaking_prompt():
    return """
    You are an expert exam question designer for a B2 CEFR level English test.
    Generate a single, clear speaking prompt that asks for an opinion, discussing advantages and/or disadvantages.
    The topic should be general, like work-life balance, technology in education, or city life vs. country life.
    
    Return the entire output as a single, valid JSON object with the following structure:
    {
        "type": "speaking-prompt",
        "level": "B2",
        "question": "The question prompt text here.",
        "preparation_time": 45,
        "speaking_time": 60
    }
    """

# Add more functions for other question types: get_writing_prompt(), get_listening_prompt(), etc.

def get_evaluation_prompt(exam_data):
    # exam_data will be a dictionary with original questions and user answers
    # This is a complex prompt that you'll need to refine.
    return f"""
    You are an expert English language exam evaluator.
    Below is a set of questions from an exam and the user's answers.
    Evaluate each answer and provide a score from 0 to 1 and brief feedback.
    For Reading/Listening, score is 1 for correct, 0 for incorrect.
    For Speaking/Writing, evaluate based on fluency, coherence, grammar, and vocabulary, and provide an overall score.

    The exam data is:
    ```json
    {str(exam_data)}
    ```

    Return your evaluation as a single, valid JSON object with the following structure:
    {
        "overall_score": 0.85, // A calculated overall percentage
        "results": [
            {
                "question_id": 1,
                "user_answer": "...",
                "score": 1,
                "feedback": "Correct."
            },
            {
                "question_id": "speaking_1",
                "user_answer": "...",
                "score": 0.7,
                "feedback": "Good fluency, but some minor grammatical errors."
            }
        ]
    }
    """