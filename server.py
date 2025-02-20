# server/server.py
import os
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables (OPENAI_API_KEY, etc.)
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

FINE_TUNED_MODEL = "ft:gpt-4o-2024-08-06:personal::B2SEozjc"
client = OpenAI(api_key=api_key)
app = Flask(__name__)
CORS(app)

@app.route("/api/qm9", methods=["POST"])
def query_qm9_model():
    """
    Receives a JSON object with { user_input: string },
    calls the fine-tuned GPT model, and returns the model's response.
    """
    data = request.json
    user_query = data.get("user_input", "")

    try:
        # Construct the messages for ChatCompletion
        messages = [
            {"role": "system", "content": "You are a quantum chemistry expert."},
            {"role": "user", "content": user_query}
        ]

        response = client.chat.completions.create(
            model=FINE_TUNED_MODEL,
            messages=messages,
            temperature=0.0
        )
        model_reply = response.choices[0].message.content
        return jsonify({"reply": model_reply})

    except Exception as e:
        # Return an error message if something goes wrong
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # You can adjust debug=True or port as desired.
    app.run(debug=True, host="0.0.0.0", port=8000)
