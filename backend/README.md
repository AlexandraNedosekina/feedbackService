# Как запустить 
Файл .env.example переименовать в .env и ввести поля

## Локально
```
pip install -r requirements.txt
uvicorn feedback.main:app
```

## В докере
```
docker build -t feedback_v1 -f Dockerfile .
docker run -p 8000:8000 feedback_v1 
```
