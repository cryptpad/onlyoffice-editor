.PHONY: build
build:
	docker build --target build -o output .

.PHONY: files
files:
	docker build --target files -o output-files .

.PHONY: onlyoffice-editor-test
onlyoffice-editor-test:
	docker build --target onlyoffice-editor-test .

.PHONY: zip-test
zip-test:
	docker build --target zip-test .

.PHONY: test
test: onlyoffice-editor-test zip-test
