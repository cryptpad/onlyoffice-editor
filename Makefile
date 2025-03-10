.PHONY: build
build:
	docker build --target build -o output .

.PHONY: onlyoffice-editor-test
onlyoffice-editor-test:
	docker build --target onlyoffice-editor-test .

.PHONY: test
test: onlyoffice-editor-test
