# Подготовка

### В папке backend

-  Файл .env.example переименовать в .env и ввести поля
   -  SECRET_KEY=secret
   -  GITLAB_CLIENT_ID = 521cd2b06148230d72a63375ddaaabab69e921816a11552b40e4dba242cd78d2
   -  GITLAB_CLIENT_SECRET = 4282320d8738b55f81119e4840428f68f05dd16ad4a9976905221b54654d8d16

### В папке frontend

-  Создать файл .env и ввести
   -  NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Запуск

Для локального запуска читай README.md в папках backend и frontend

## Через Docker

### Весь проект

```bash
docker-compose up -d
```

или через Makefile

```bash
make up
```

### Только backend

```bash
docker-compose up -d backend
```

```bash
make up-backend
```

### Только frontend

```bash
docker-compose up -d frontend
```

```bash
make up-frontend
```

### Для пересборки

```bash
docker-compose up -d (frontend | backend) --build
```

```bash
make up-(frontend | backend)-build
```

### Остановка

```bash
docker-compose down
```

```bash
make down
```
