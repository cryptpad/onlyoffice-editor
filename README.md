# TODO

# Build onlyoffice-editor.zip

Run

```
make build
```

and find the result here: `output/onlyoffice-editor.zip`

# Running all tests

```
make test
```

# Diff changes we made to sdkjs and web-apps

## sdkjs

```sh
git fetch --depth=1 https://github.com/ONLYOFFICE/sdkjs.git v7.3.3.60
git diff FETCH_HEAD HEAD:sdkjs
```

## web-apps

```sh
git fetch --depth=1 https://github.com/ONLYOFFICE/web-apps.git v7.3.3.60
git diff FETCH_HEAD HEAD:web-apps
```

## diff UI

Instead of calling `git diff ...`, you can use `git difftool --dir-diff ...` with the same parameters, to see the diff in a UI.
