from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import requests
import uvicorn

app = FastAPI()

# Input model
class LocationRequest(BaseModel):
    location: str

@app.post("/api/generate")
async def generate_shot_list(request: LocationRequest):
    location = request.location
    prompt = (
        f"Act as a professional cinematographer. Create a detailed 1-minute video shot list "
        f"for a travel vlog in {location}. Format as a concise Markdown table with columns: "
        f"Time, Shot Description, and Camera Movement. Use cinematic language."
    )
    
    try:
        # Using Pollinations AI - Free, no sign-in
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "model": "openai", # Defaulting to openai-like model on pollinations
            "jsonMode": False
        }
        
        response = requests.post("https://text.pollinations.ai/", json=payload, timeout=60)
        
        if response.status_code == 200:
            return {"shot_list": response.text}
        else:
            raise HTTPException(status_code=500, detail="AI Service Error")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
