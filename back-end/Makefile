checkformat:
	npx prettier ./src --check
autoformat:
	npx prettier ./src --write
install:
	npm install
init_db:
	npx prisma migrate dev
run: install init_db
	npm run dev
test:
	npx prisma migrate reset --force
	npm run test