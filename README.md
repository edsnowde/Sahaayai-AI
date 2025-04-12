# 🧓🎙️ SahaayAI – Voice-First AI Companion for the Elderly

**SahaayAI** is a voice-first, multilingual AI assistant designed to bridge the digital divide for senior citizens. Built with emotional intelligence and accessibility in mind, it simplifies access to information, health reminders, and digital services through natural speech — with the comforting option of mimicking familiar voices.

---

## 🚨 Problem

Senior citizens are increasingly disconnected from today's digital world due to complex interfaces, lack of support, and social isolation — leading to reduced access to healthcare, services, and companionship.

---

## 💡 Solution

**SahaayAI** offers a voice-based, multilingual AI companion that mimics the voice of a loved one to help with daily wellness, provide reminders, and offer meaningful interaction — all through simple, intuitive speech commands.

---

## 🛠️ Tech Stack

### 🔹 Frontend

| Category         | Tech Used            | Purpose                                              |
|------------------|----------------------|------------------------------------------------------|
| Framework        | React + TypeScript   | Component-based UI with static typing                |
| Styling          | Tailwind CSS         | Fast, utility-first styling                          |
| Build Tool       | Vite                 | Lightweight bundling and dev server                 |
| UI Components    | shadcn/ui            | Accessible prebuilt components                      |
| Routing          | React Router         | SPA navigation                                       |
| Notifications    | Sonner               | Toast notifications                                 |
| Icons            | Lucide React         | Icon set                                             |
| Voice Handling   | Web Speech API, ElevenLabs | Speech recognition and text-to-speech        |
---

### 🔹 Backend

| Category           | Tech / Library               | Role                                                           |
|--------------------|------------------------------|----------------------------------------------------------------|
| Framework          | Flask, Flask-CORS            | Backend APIs and cross-origin support                         |
| AI / LLM           | Google Gemini (via `google.generativeai`) | Prompt-based responses and multilingual support         |
| Machine Learning   | scikit-learn, numpy, pandas  | Anomaly detection, data processing                            |
| Voice Tech         | ElevenLabs, Whisper, Google STT | Voice cloning & speech-to-text                             |
| Storage            | Firebase                     | User data and reminders                                       |
| PDF Generation     | reportlab                    | Creating downloadable health summaries or reports             |
| Utilities          | os, hashlib                  | File handling and hashing                                     |
| Custom Modules     | main.py, call_handler.py, tts_feedback.py | Core logic, contact simulation, TTS feedback     |
| File Sending       | render_template, send_file   | Serve frontend templates or downloadable content              |

---

## ✨ Key Features

- 🎤 Natural voice input using Web Speech API or Whisper
- 🗣️ Emotionally resonant voice output with ElevenLabs voice cloning
- 🧠 LLM-backed smart responses (via Gemini)
- 📋 PDF health summary generation
- ⏱️ Customizable response delays and voice preferences
- 🔄 Multilingual translation and contextual memory (RAG)
- 🧓 Nostalgic UI designed for seniors
- 🔐 Optional OTP login for caregiver-linked accounts

---

## ⚙️ Installation Instructions

### ✅ Frontend Setup

```bash
git clone https://github.com/your-username/sahaayai.git
cd sahaayai/client
npm install
npm install vite --save-dev
npm run dev

✅ Backend Setup

cd ../server
python -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
Create a .env file in the /server directory and add your credentials:

env

ELEVENLABS_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key
FIREBASE_CONFIG=your_firebase_credentials

Then run the backend:
python main.py
📦 Required Python Packages
Make sure to install these dependencies if requirements.txt is not present:

pip install flask flask-cors google-generativeai scikit-learn pandas numpy reportlab

📄 Folder Structure

sahaayai/
├── client/                   # React frontend
├── server/                   # Flask backend
│   ├── main.py
│   ├── call_handler.py
│   ├── tts_feedback.py
│   └── templates/
└── README.md

