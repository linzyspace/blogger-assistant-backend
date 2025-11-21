
from flask import Flask, request
from vertexai.language_models import TextGenerationModel
import google.auth

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    model = TextGenerationModel.from_pretrained("gemini-1.5-pro")

    response = model.predict(prompt)
    return {"result": response.text}
