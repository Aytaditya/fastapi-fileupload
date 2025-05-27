from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
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

@app.post("/create-excel/")
async def create_excel(file: UploadFile = File(...)):  # file input just to trigger the endpoint
    # Create a new DataFrame
    data = {
        'name': ['Alice', 'Bob', 'Charlie'],
        'email': ['alice@example.com', 'bob@example.com', 'charlie@example.com'],
        'age': [25, 30, 22]
    }
    df = pd.DataFrame(data)

    # Write DataFrame to an Excel file in memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Users')

    output.seek(0)

    return StreamingResponse(
        output,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={"Content-Disposition": "attachment; filename=generated_data.xlsx"}
    )
