dev-file:
	deno run --allow-read ./src/main.ts ./mock/mini
dev-pipe:
	seq 10 | awk '{ print rand() }' | deno run ./src/main.ts
lint:
	deno lint --unstable
test:
	deno test
build:
	mkdir -p release
	deno compile --unstable --allow-read --output release/opstats ./src/main.ts