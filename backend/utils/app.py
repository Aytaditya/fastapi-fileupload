from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse,JSONResponse
import pandas as pd
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "FastAPI is working!"}


@app.post("/upload-excel/") 
async def upload_excel(file: UploadFile = File(...)):
    # Read uploaded Excel file
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    # Add columns
    df['name'] = 'John Doe'
    df['email'] = 'johndoe@example.com'
    df['age'] = 30

    # Save modified Excel to BytesIO
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    output.seek(0)

    # Send file back as response
    return StreamingResponse(output, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',headers={"Content-Disposition": f"attachment; filename=modified_{file.filename}"})