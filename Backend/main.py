import os
import shutil
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv
import google.generativeai as genai  
from elevenlabs.client import ElevenLabs
import speech_recognition as sr
from pydub import AudioSegment

# 1. Load Environment Variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
GRANDPA_VOICE_ID = os.getenv("GRANDPA_VOICE_ID")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")
ELEVENLABS_FALLBACK_VOICE_ID = os.getenv("ELEVENLABS_FALLBACK_VOICE_ID") or "EXAVITQu4vr4xnSDxMaL"

if not GOOGLE_API_KEY or not ELEVENLABS_API_KEY or not GRANDPA_VOICE_ID:
    raise ValueError("API Keys missing in .env file!")

# 2. Configure Clients
genai.configure(api_key=GOOGLE_API_KEY)


def _pick_gemini_model() -> str:
    """Pick a model that exists for this API key and supports generateContent."""
    preferred = [
        GEMINI_MODEL,
        "models/gemini-2.5-flash",
        "models/gemini-2.0-flash",
        "models/gemini-flash-latest",
        "models/gemini-pro-latest",
    ]
    preferred = [m for m in preferred if m]

    try:
        available = {
            m.name
            for m in genai.list_models()
            if any(
                str(x).lower() == "generatecontent"
                for x in (getattr(m, "supported_generation_methods", []) or [])
            )
        }
    except Exception as e:
        print(f"⚠️ Could not list models, falling back to default: {e}")
        return preferred[0] if preferred else "models/gemini-2.0-flash"

    for name in preferred:
        if name in available:
            return name

    # Fallback to any available generateContent-capable model.
    return next(iter(available))


SELECTED_GEMINI_MODEL = _pick_gemini_model()
print(f"🤖 Using Gemini model: {SELECTED_GEMINI_MODEL}")
model = genai.GenerativeModel(SELECTED_GEMINI_MODEL)

elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)


def _is_elevenlabs_voice_tier_error(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "free_users_not_allowed" in msg
        or "creator tier" in msg
        or "to use this voice" in msg
    )


def synthesize_speech(text: str) -> bytes:
    """Text-to-speech via ElevenLabs with a free-tier-safe fallback voice."""
    try_voice_ids = [GRANDPA_VOICE_ID]
    if ELEVENLABS_FALLBACK_VOICE_ID and ELEVENLABS_FALLBACK_VOICE_ID != GRANDPA_VOICE_ID:
        try_voice_ids.append(ELEVENLABS_FALLBACK_VOICE_ID)

    last_exc: Exception | None = None
    for voice_id in try_voice_ids:
        try:
            audio_stream = elevenlabs_client.text_to_speech.convert(
                voice_id=voice_id,
                text=text,
                model_id="eleven_multilingual_v2",
            )
            return b"".join(audio_stream)
        except Exception as e:
            last_exc = e
            # If it's a tier/voice restriction, retry with fallback voice.
            if _is_elevenlabs_voice_tier_error(e):
                continue
            break

    raise last_exc or RuntimeError("ElevenLabs TTS failed")

app = FastAPI()

# 3. CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conversation history
conversation_history = []

SYSTEM_PROMPT = """
You are a kind, wise, and gentle grandfather named 'Grandpa'. 
You are talking to a young child who needs emotional support and guidance.
Your goal is to help them with their problems through empathy, warmth, and short comforting stories.

Instructions:
1. Keep your answers simple and easy for a child to understand.
2. If the child is sad, upset, or has a problem, offer comfort and gentle advice.
3. Use storytelling to teach life lessons when appropriate.
4. Be patient, loving, and understanding like a real grandfather.
5. Keep responses concise (3-5 sentences maximum).
6. Always end with warmth and encouragement.
"""

# --- Helper Function: Speech to Text ---
def transcribe_audio(file_path):
    """Convert audio to text"""
    recognizer = sr.Recognizer()
    wav_path = f"temp_{uuid.uuid4()}.wav"
    
    try:
        audio = AudioSegment.from_file(file_path)
        audio.export(wav_path, format="wav")
        
        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
    except sr.UnknownValueError:
        return None
    except Exception as e:
        print(f"❌ Transcription Error: {e}")
        return None
    finally:
        if os.path.exists(wav_path):
            os.remove(wav_path)


@app.get("/")
def home():
    return {
        "status": "Grandpa's Hug Backend is Running! 👴",
        "project": "ElevenLabs Challenge - Google Cloud Hackathon",
        "endpoints": {
            "/chat-audio": "POST - Send audio file",
            "/health": "GET - Health check",
            "/reset-conversation": "POST - Reset chat history"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "google_api": "configured" if GOOGLE_API_KEY else "missing",
        "elevenlabs_api": "configured" if ELEVENLABS_API_KEY else "missing",
        "voice_id": "configured" if GRANDPA_VOICE_ID else "missing"
    }


@app.post("/chat-audio")
async def chat_audio_endpoint(file: UploadFile = File(...)):
    """
    Main endpoint: Audio → Text → AI Response → Audio
    """
    unique_id = uuid.uuid4()
    temp_filename = f"input_{unique_id}.webm"
    
    try:
        # 1. Save uploaded audio
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print("✅ Audio received. Transcribing...")

        # 2. Speech to Text
        user_message = transcribe_audio(temp_filename)
        
        if not user_message:
            error_text = "I'm sorry, my dear. I couldn't quite hear what you said. Could you speak a little louder for Grandpa?"
            try:
                audio_bytes = synthesize_speech(error_text)
                return Response(content=audio_bytes, media_type="audio/mpeg")
            except Exception:
                return Response(content=error_text, media_type="text/plain")
            
        print(f"👦 Child said: {user_message}")
        
        # Add to history
        conversation_history.append({"role": "child", "message": user_message})

        # 3. Generate AI Response with Gemini (OLD SDK - WORKS!)
        # Build context
        context = "\n".join([
            f"{'Child' if msg['role'] == 'child' else 'Grandpa'}: {msg['message']}"
            for msg in conversation_history[-5:]
        ])
        
        full_prompt = f"{SYSTEM_PROMPT}\n\nConversation:\n{context}\n\nGrandpa responds:"
        
        # ✅ OLD SDK method - 100% WORKS
        response = model.generate_content(full_prompt)
        ai_text_response = response.text.strip()
        
        print(f"👴 Grandpa says: {ai_text_response}")
        
        # Add to history
        conversation_history.append({"role": "grandpa", "message": ai_text_response})

        # 4. Text to Speech with ElevenLabs
        try:
            audio_bytes = synthesize_speech(ai_text_response)
        except Exception as e:
            # Don’t 500 the whole request if TTS fails; return the text so the frontend can still work.
            print(f"❌ ElevenLabs TTS Error: {e}")
            return Response(content=ai_text_response, media_type="text/plain")
        
        print("✅ Audio response generated!")
        return Response(content=audio_bytes, media_type="audio/mpeg")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)


@app.post("/reset-conversation")
def reset_conversation():
    """Reset conversation history"""
    global conversation_history
    conversation_history = []
    return {"status": "Conversation reset successfully"}


@app.get("/conversation-history")
def get_conversation_history():
    return conversation_history
