FROM python:3.11.0-slim 

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1 
ENV PYTHONUNBUFFERED 1 

COPY ./requirements.txt /app
COPY ./.env /app

RUN pip install --no-cache-dir -r requirements.txt

COPY ./feedback /app/feedback 
CMD ["python", "-m" ,"feedback.main"]
