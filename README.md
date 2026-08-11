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
git fetch --depth=1 https://github.com/Euro-Office/sdkjs.git v9.3.2
git diff FETCH_HEAD HEAD:sdkjs
```

## web-apps

```sh
git fetch --depth=1 https://github.com/Euro-Office/web-apps.git v9.3.2
git diff FETCH_HEAD HEAD:web-apps
```

## diff UI

Instead of calling `git diff ...`, you can use `git difftool --dir-diff ...` with the same parameters, to see the diff in a UI.

# Pull OnlyOffice upstream changes
```shell
git subtree pull --prefix sdkjs https://github.com/Euro-Office/sdkjs.git <TAG> --squash
git subtree pull --prefix web-apps https://github.com/Euro-Office/web-apps.git <TAG> --squash
```
