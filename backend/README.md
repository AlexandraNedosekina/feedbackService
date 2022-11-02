# Как запустить 
Файл .env.example переименовать в .env и ввести поля

## Локально
```
python -m venv env

source env/bin/activate # Для линукса
env\Scripts\activate.ps1 # Для винды (1) или
env\Scripts\activate.bat # Для винды (2)

pip install -r requirements.txt
uvicorn feedback.main:app
```

## В докере
```
docker build -t feedback_v1 -f Dockerfile .
docker run -p 8000:8000 feedback_v1 
```
