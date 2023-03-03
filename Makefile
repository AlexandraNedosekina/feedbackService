up:
	docker-compose --env-file ./backend/.env up -d
up-build:
	docker-compose --env-file ./backend/.env up -d --build
up-backend:
	docker-compose --env-file ./backend/.env up -d backend
up-backend-build:
	docker-compose --env-file ./backend/.env up -d --build backend
up-frontend:
	docker-compose --env-file ./backend/.env up -d frontend
up-frontend-build:
	docker-compose --env-file ./backend/.env up -d --build frontend
down:
	docker-compose down
