BIN=dist/src/main.js
SRC =$(shell find src/ -type f -name '*.ts')

NPM_TASKS=test clean

.PHONY: build
build: $(BIN)

.PHONY: serve
serve: $(BIN)
	npm run start

package-lock.json: package.json 
	npm install
	touch package-lock.json

$(BIN): package-lock.json $(SRC)
	npm run build

.PHONY: $(NPM_TASKS)
$(NPM_TASKS): package-lock.json
	npm run $@