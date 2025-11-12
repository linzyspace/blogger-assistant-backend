from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Blogger

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()  # Get JSON from request
    message = data.get("message")  # Extract the user message

    if not message:
        return jsonify({"reply": "I didn't get that!"})

    # Example bot response — replace this with your logic
    reply = f"You said: {message}"

    return jsonify({"reply": reply})
