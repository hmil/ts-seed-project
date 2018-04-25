# === Variables ===

# This puts all folders under `packages` in the variable PACKAGES
PACKAGES := $(wildcard packages/*/*)

# These tasks must be defined in each package. Add or remove from this list as you wish
TASKS :=build clean test

# === Default task: Do not add any task above this line!
.PHONY: all
all:
	$(MAKE) build

# === Dependencies ===

# You must define here the dependencies between package. Use one line per package.
# Put the full path to the package on the left hand side and its dependencies on the right hand side, separated by spaces.
# Be careful not to introduce circular dependencies!

packages/*/tstuto-api:
packages/*/tstuto-server: packages/*/tstuto-api
packages/*/tstuto-web-client: packages/*/tstuto-api


# === Custom tasks ===

# This task is used to start up the web server
.PHONY: serve
serve:
	$(MAKE) build
	$(MAKE) -C packages/*/tstuto-server serve


# Publishes all packages to npm
.PHONY: publish
publish: node_modules
	$(MAKE) test
	$(MAKE) clean
	$(MAKE) build
	node_modules/.bin/ts-node tools/publish.ts


# === Boilerplate ===
# This tells make to execute the tasks defined in "TASKS" individually 
# into each package (ordered according to the dependencies defined above).

.PHONY: $(TASKS)
$(TASKS): $(PACKAGES)

.PHONY: $(PACKAGES)
$(PACKAGES):
	$(MAKE) -C $@ $(MAKECMDGOALS)

node_modules: package.json package-lock.json
	npm install
	touch node_modules