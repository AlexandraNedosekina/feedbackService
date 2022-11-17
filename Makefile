up:
	docker-compose up -d
up-build:
	docker-compose up -d --build
up-backend:
	docker-compose up -d backend
up-backend-build:
	docker-compose up -d --build backend
up-frontend:
	docker-compose up -d frontend
up-frontend-build:
	docker-compose up -d --build frontend
down:
	docker-compose down
