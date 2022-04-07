all: install run

install:
	npm i
run:
	make -j 2 backend-dev frontend-dev
backend-dev:
	cd ./server && go run .
frontend-dev:
	ng serve
build: install
	ng build --prod
	cd ./server && go build -tags prod
test: install
	cd ./server && go test
	npm run e2e
