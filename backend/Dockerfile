FROM python:3.11.0-slim 

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1 
ENV PYTHONUNBUFFERED 1 

RUN apt-get update \
    && apt-get install -y libpq-dev gcc build-essential \
    && pip install psycopg2

COPY ./requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY ./feedback /app/feedback 
CMD ["uvicorn", "feedback.main:app", "--host", "0.0.0.0", "--port" , "8000"]
