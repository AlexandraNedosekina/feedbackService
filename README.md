## Запуск проекта

### В папке backend

-  Файл .env.example переименовать в .env и ввести поля

### В папке frontend

-  Создать файл .env и ввести NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
-  npm i
-  npm run dev

### Запуск

```bash
docker-compose up -d
```

или через Makefile

```bash
make docker-up
```
