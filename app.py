from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "").lower()

    # Simple logic
    if "hello" in user_input:
        reply = "Hi there! I'm your Blogger Assistant 🤖"
    elif "your name" in user_input:
        reply = "I'm BlogBot, your friendly assistant!"
    elif "bye" in user_input:
        reply = "Goodbye! Have a great day 🌞"
    else:
        reply = "Sorry, I didn’t understand that. Try asking something else."

    return jsonify({"reply": reply})

@app.route("/")
def home():
    return "Blogger Assistant is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
