BIN=public/dist/main.js
SRC =$(shell find src/ -type f -name '*.ts')

NPM_TASKS=test clean

.PHONY: build
build: $(BIN)

package-lock.json: package.json
	npm install
	touch package-lock.json

$(BIN): package-lock.json $(SRC)
	npm run build

.PHONY: $(NPM_TASKS)
$(NPM_TASKS): package-lock.json
	npm run $@
