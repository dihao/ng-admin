.PHONY: build

install:
	bower install
	npm install
	./node_modules/protractor/bin/webdriver-manager update

run:
	@grunt

build-dev:
	@grunt build:dev
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (no minification)"

build:
	@grunt build
	@echo "Files build/ng-admin.min.css and build/ng-admin.min.js updated (with minification)"

test:
	@grunt test:local

es6-test:
	mocha --compilers js:mocha-traceur --recursive src/javascripts/ng-admin/es6/tests/

es6-watch:
	./node_modules/watch/cli.js "./node_modules/jspm/jspm.js bundle-sfx src/javascripts/ng-admin/es6/lib/main" src/javascripts/ng-admin/es6/lib/
