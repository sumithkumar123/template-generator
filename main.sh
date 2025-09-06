cd template_generator/backend

python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt

export OPENAI_API_KEY="your-actual-api-key-here"

uvicorn app.main:app --reload
        The backend server will now be running at `http://127.0.0.1:8000`.

cd template_generator/frontend

npm install

npm run dev
        The frontend will now be running at `http://localhost:5173` (or a similar port).