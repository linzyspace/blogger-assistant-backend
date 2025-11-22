from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Keyword-based responses with multiple options
keyword_responses = {
    ("hi", "hello", "hey"): [
        "Hello! How can I help you today?",
        "Hi there! Great to see you!",
        "Hey! How’s it going?"
    ],
    ("what is ai", "ai", "what is good about your blog"): [
        "AI is Artificial Intelligent"
    ],
    ("what is good about your blog?"): [
        "You can check out my blog for more information"
    ],
    ("how are you", "how's it going"): [
        "I'm just a bot, but I'm ready to chat!",
        "Doing great! How about you?",
        "All systems operational!"
    ],
    ("bye", "goodbye", "see you"): [
        "Goodbye! Have a great day!",
        "See you later! Take care!",
        "Bye! Come back soon!"
    ],
    ("thanks", "thankyou", "thank you"): [
        "You're welcome! 😊",
        "No problem!",
        "Anytime!"
    ],
    ("help", "support", "assist"): [
        "Sure! What do you need help with?",
        "I'm here to assist you. Please tell me more.",
        "I can help! What’s your question?"
    ]
}

# Fallback responses if no keywords match
fallback_responses = [
    "I'm not sure how to respond to that.",
    "Can you rephrase that?",
    "Interesting! Tell me more."
]



@app.route("/")
def home():
    return "Blogger Assistant is running!"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip().lower()

    if not message:
        return jsonify({"reply": "I didn't get that!"})

    matched_responses = []

    # Check for multiple keyword matches
    for keywords, responses in keyword_responses.items():
        if any(keyword in message for keyword in keywords):
            matched_responses.append(random.choice(responses))

    # Combine multiple responses if we matched more than one keyword
    if matched_responses:
        # Join with spaces to make a coherent message
        reply = " ".join(matched_responses)
    else:
        # Use a random fallback if nothing matches
        reply = random.choice(fallback_responses)

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

