BIN=dist/index.js
SRC =$(shell find src/ -type f -name '*.ts')
NODE_MODULES=node_modules/.makets
NPM_TASKS=test clean

.PHONY: build
build: $(BIN)

$(NODE_MODULES): package.json package-lock.json
	npm install
	touch $(NODE_MODULES)

$(BIN): $(NODE_MODULES) $(SRC)
	npm run build

.PHONY: $(NPM_TASKS)
$(NPM_TASKS): package-lock.json
	npm run $@
