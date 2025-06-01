from flask import Flask, request, jsonify
from transformers import pipeline
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# Initialize summarization pipeline once (this loads model in memory)
summarizer = pipeline("summarization")

@app.route('/process', methods=['POST'])
def process_text():
    data = request.json
    text = data.get('text', '')

    # Summarize using Hugging Face transformer
    summary_result = summarizer(text, max_length=1000, min_length=30, do_sample=False)
    summary = summary_result[0]['summary_text']

    # Named Entity Recognition using spaCy
    doc = nlp(text)
    entities = [{'text': ent.text, 'label': ent.label_} for ent in doc.ents]

    return jsonify({
        'summary': summary,
        'entities': entities
    })

if __name__ == '__main__':
    app.run(port=5001)
