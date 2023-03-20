# Как запустить 
Файл .env.example переименовать в .env и ввести поля

## Локально
```
python -m venv env

source env/bin/activate # Для линукса
env\Scripts\activate # Для винды

pip install -r requirements.txt
python -m feedback.main
```

## В докере
```
docker build -t feedback_v1 -f Dockerfile .
docker run -p 8000:8000 feedback_v1 
```
