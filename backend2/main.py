import os
import shutil
import io
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from elevenlabs.client import ElevenLabs
import speech_recognition as sr
from pydub import AudioSegment

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
GRANDPA_VOICE_ID = os.getenv("GRANDPA_VOICE_ID") 

if not GOOGLE_API_KEY:
    raise ValueError("Error: GOOGLE_API_KEY not found in .env file")
if not ELEVENLABS_API_KEY:
    raise ValueError("Error: ELEVENLABS_API_KEY not found in .env file")

genai.configure(api_key=GOOGLE_API_KEY)
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)


model = genai.GenerativeModel('gemini-1.5-flash') 

app = FastAPI()
# 3. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SYSTEM PROMPT ---
SYSTEM_PROMPT = """
You are a kind, wise, and gentle grandfather named 'Grandpa Gem'. 
You are talking to a young child.
Your goal is to answer their questions with empathy, warmth, and short stories.
Instructions:
1. Keep your answers simple and easy for a child to understand.
2. If the child is sad, offer comfort.
3. Keep responses concise (under 3-4 sentences).
"""

# --- Helper Function: Speech to Text ---
def transcribe_audio(file_path):
    recognizer = sr.Recognizer()
    
   
    try:
        audio = AudioSegment.from_file(file_path)
        wav_path = "temp_converted.wav"
        audio.export(wav_path, format="wav")
        
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
            
            text = recognizer.recognize_google(audio_data)
            return text
    except Exception as e:
        print(f"Transcription Error: {e}")
        return ""

@app.get("/")
def home():
    return {"status": "Grandpa's Hug Backend (Voice Enabled) is Running!"}

# --- NEW: Audio Input Endpoint ---
@app.post("/chat-audio")
async def chat_audio_endpoint(file: UploadFile = File(...)):
    temp_filename = "temp_input_audio.webm" 
    
    try:
        
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print("Audio received. Transcribing...")

        
        user_message = transcribe_audio(temp_filename)
        
        if not user_message:
            return {"error": "i cant understand son,."}
            
        print(f"Child Asked (Text): {user_message}")

     
        full_prompt = f"{SYSTEM_PROMPT}\n\nChild asks: {user_message}\nGrandpa says:"
        response = model.generate_content(full_prompt)
        ai_text_response = response.text
        
        print(f"Grandpa Says: {ai_text_response}")

    
        audio_response = elevenlabs_client.text_to_speech.convert(
            voice_id=GRANDPA_VOICE_ID,
            text=ai_text_response,
            model_id="eleven_monolingual_v1"
        )
        
    
        audio_bytes = b"".join(audio_response)

        from fastapi.responses import Response
        return Response(content=audio_bytes, media_type="audio/mpeg")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
   
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if os.path.exists("temp_converted.wav"):
            os.remove("temp_converted.wav")

# Run: uvicorn main:app --reload