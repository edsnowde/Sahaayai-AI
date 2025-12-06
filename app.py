from flask import Flask, request, jsonify, Response
import google.generativeai as genai
from flask_cors import CORS
import traceback
import logging
import os
import requests

app = Flask(__name__)
CORS(app)  # Allow frontend requests from any domain (dev only)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# IMPORTANT: For production, don't hardcode API keys. Use environment variables or a secrets manager.
genai.configure(api_key="enter your api key")
# Model selection may vary depending on your google.generativeai SDK version.
model = genai.GenerativeModel("gemini-2.5-flash")

# Default ElevenLabs voice (fallback)
DEFAULT_ELEVEN_VOICE = "EXAVITQu4vr4xnSDxMaL"


@app.route('/api/tts', methods=['POST'])
def proxy_elevenlabs_tts():
    """Proxy endpoint to call ElevenLabs TTS from server-side to avoid CORS and keep API key secret.
    Expects JSON: { text: string, voiceId?: string }
    Returns: binary audio stream from ElevenLabs with original content-type forwarded.
    """
    try:
        data = request.get_json(force=True)
        text = data.get('text', '')
        voice_id = data.get('voiceId') or DEFAULT_ELEVEN_VOICE

        if not text:
            return jsonify({'error': 'Missing text'}), 400

        # Read API key from environment variable. Set ELEVENLABS_API_KEY in your .env or server env.
        eleven_api_key = os.environ.get('ELEVENLABS_API_KEY')
        if not eleven_api_key:
            return jsonify({'error': 'ElevenLabs API key not configured on server'}), 500

        url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'
        payload = {
            'text': text,
            'model_id': 'eleven_multilingual_v2',
            'voice_settings': {
                'stability': 0.5,
                'similarity_boost': 0.5
            }
        }
        headers = {
            'Content-Type': 'application/json',
            'xi-api-key': eleven_api_key
        }

        resp = requests.post(url, json=payload, headers=headers, stream=True, timeout=30)

        if not resp.ok:
            return jsonify({'error': f'ElevenLabs API error: {resp.status_code} {resp.text}'}), 502

        content_type = resp.headers.get('Content-Type', 'application/octet-stream')
        return Response(resp.content, content_type=content_type)

    except Exception as e:
        tb = traceback.format_exc()
        logger.error('Exception in /api/tts: %s\n%s', e, tb)
        return jsonify({'error': str(e), 'trace': tb}), 500



@app.route('/api/voice-assistant', methods=['POST'])
def generate_response():
    try:
        data = request.get_json(force=True)
        logger.debug('Received request JSON: %s', data)
        prompt = data.get('prompt', '') if isinstance(data, dict) else ''

        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        # Call the generative model. If this raises, we'll log the full traceback below.
        response = model.generate_content(prompt)

        # `response` shape can vary depending on SDK; try to extract a sensible string
        text = getattr(response, 'text', None) or str(response)
        return jsonify({'response': text})

    except Exception as e:
        tb = traceback.format_exc()
        logger.error('Exception while generating response: %s\n%s', e, tb)
        # Return a concise error to the client and log the full traceback server-side
        return jsonify({'error': str(e), 'trace': tb}), 500


if __name__ == '__main__':
    # Keep debug=True during local development to get the Werkzeug debugger
    app.run(debug=True)
