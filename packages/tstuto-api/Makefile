BIN=dist/index.js
SRC =$(shell find src/ -type f -name '*.ts')

NPM_TASKS=test clean

.PHONY: build
build: $(BIN)

node_modules: package.json package-lock.json
	npm install
	touch node_modules

$(BIN): node_modules $(SRC)
	npm run build

.PHONY: $(NPM_TASKS)
$(NPM_TASKS): package-lock.json
	npm run $@
