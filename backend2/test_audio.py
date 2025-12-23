"""
Simple test script to test the backend without audio recording
"""
import requests
import os

# Test 1: Check if server is running
print("=" * 50)
print("Test 1: Checking if server is running...")
print("=" * 50)

try:
    response = requests.get("http://127.0.0.1:8000/")
    print(f"✅ Status Code: {response.status_code}")
    print(f"✅ Response: {response.json()}")
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nMake sure server is running: python -m uvicorn main:app --reload")
    exit()

# Test 2: Test with a sample audio file (if exists)
print("\n" + "=" * 50)
print("Test 2: Testing /chat-audio endpoint")
print("=" * 50)

# Try to find a sample audio file
sample_files = ["test.ogg", "test.mp3", "test.wav", "sample.mp3", "sample.wav", "sample.ogg"]
audio_file = None

for file in sample_files:
    if os.path.exists(file):
        audio_file = file
        break

if audio_file:
    print(f"Using audio file: {audio_file}")
    try:
        with open(audio_file, 'rb') as f:
            files = {'file': (audio_file, f, 'audio/mpeg')}
            response = requests.post("http://127.0.0.1:8000/chat-audio", files=files)
            
        print(f"✅ Status Code: {response.status_code}")
        print(f"✅ Response Type: {response.headers.get('content-type')}")
        print(f"✅ Response Size: {len(response.content)} bytes")
        
        # Save response audio
        with open("response_audio.mp3", "wb") as f:
            f.write(response.content)
        print("✅ Response saved to: response_audio.mp3")
        
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("⚠️  No sample audio file found.")
    print("Please place a test audio file (test.mp3 or test.wav) in this directory")
    print("\nOr use Postman/Thunder Client to test with an audio file")

print("\n" + "=" * 50)
print("POSTMAN TEST INSTRUCTIONS:")
print("=" * 50)
print("1. Open Postman")
print("2. Create new POST request")
print("3. URL: http://127.0.0.1:8000/chat-audio")
print("4. Body → form-data")
print("5. Key: 'file' (select 'File' type)")
print("6. Value: Select any audio file (.mp3, .wav, .webm)")
print("7. Click Send")
print("=" * 50)
