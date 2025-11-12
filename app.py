from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Blogger

@app.route("/")
def home():
    return "Blogger Assistant is running!"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()  # Get the message from Blogger
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"reply": "I didn't get that!"})

    # Example bot logic — replace this with your own
    reply = f"You said: {message}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

