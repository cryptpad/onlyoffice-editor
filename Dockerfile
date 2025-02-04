###################### onlyoffice-editor-build ################################
FROM node AS onlyoffice-editor-build
RUN corepack enable pnpm
WORKDIR /app
COPY onlyoffice-editor/package.json /app
COPY onlyoffice-editor/pnpm-lock.yaml /app
RUN pnpm install
COPY onlyoffice-editor/tsconfig.json /app
COPY onlyoffice-editor/webpack.config.mjs /app
COPY onlyoffice-editor/src/ /app/src
RUN pnpm build

FROM onlyoffice-editor-build AS onlyoffice-editor-test
COPY onlyoffice-editor/eslint.config.mjs /app
COPY onlyoffice-editor/.prettierignore /app
COPY .editorconfig /app
RUN pnpm lint


###################### sdkjs $ web-apps ################################
FROM ubuntu AS sdkjs-build
RUN apt-get update && apt-get install -y openjdk-21-jdk npm
RUN npm install -g grunt
COPY sdkjs /app/sdkjs
COPY web-apps /app/web-apps
WORKDIR /app/sdkjs
RUN make
RUN mv deploy/web-apps/apps/api/documents/api.js deploy/web-apps/apps/api/documents/api-orig.js


FROM ubuntu AS zip-build
RUN apt-get update && apt-get install -y zip
COPY --from=sdkjs-build /app/sdkjs/deploy/web-apps /app/web-apps
COPY --from=sdkjs-build /app/sdkjs/deploy/sdkjs /app/sdkjs
COPY vendor /app/web-apps/vendor
COPY fonts /app/fonts
COPY dictionaries /app/dictionaries
COPY --from=onlyoffice-editor-build /app/dist/api.js /app/web-apps/apps/api/documents/api.js
WORKDIR /app
RUN zip -r onlyoffice-editor.zip .
RUN sha512sum onlyoffice-editor.zip > onlyoffice-editor.zip.sha512


FROM scratch AS build
COPY --from=zip-build /app/onlyoffice-editor.zip /
COPY --from=zip-build /app/onlyoffice-editor.zip.sha512 /
