checkformat:
	npx prettier ./src --check
autoformat:
	npx prettier ./src --write
install:
	npm install
run: install
	npm run dev
test:
	cd ../../back-end && npx prisma migrate reset --force
	npm run test