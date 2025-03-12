# Use this (large) base image in every build below, to reduce the overall docker cache size
FROM ubuntu:24.04 AS base
RUN apt-get update && apt-get install -y openjdk-21-jdk npm wget zip
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm env use --global lts
RUN pnpm install -g grunt

###################### onlyoffice-editor-build ################################
FROM base AS onlyoffice-editor-build
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


###################### sdkjs & web-apps ################################
FROM base AS sdkjs-build
RUN apt-get update && apt-get install -y openjdk-21-jdk npm
COPY sdkjs /app/sdkjs
COPY web-apps /app/web-apps
COPY fonts/*.png /app/sdkjs/common/Images
COPY fonts/*.js /app/sdkjs/common
WORKDIR /app/sdkjs
RUN make
RUN mv deploy/web-apps/apps/api/documents/api.js deploy/web-apps/apps/api/documents/api-orig.js


FROM base AS zip-build
COPY --from=sdkjs-build /app/sdkjs/deploy/web-apps /app/web-apps
COPY --from=sdkjs-build /app/sdkjs/deploy/sdkjs /app/sdkjs
COPY vendor /app/web-apps/vendor
COPY fonts/*.ttf /app/fonts/fonts/
COPY dictionaries /app/dictionaries
COPY --from=onlyoffice-editor-build /app/dist/api.js /app/web-apps/apps/api/documents/api.js
WORKDIR /app
RUN zip -r onlyoffice-editor.zip .
RUN sha512sum onlyoffice-editor.zip > onlyoffice-editor.zip.sha512



FROM zip-build AS zip-test
RUN unzip -l onlyoffice-editor.zip > zip.content
RUN grep ' sdkjs/common/AllFonts.js' zip.content
RUN grep ' sdkjs/common/Images/fonts_thumbnail@2x.png' zip.content
RUN grep ' fonts/fonts/calibri.ttf' zip.content


FROM scratch AS build
COPY --from=zip-build /app/onlyoffice-editor.zip /
COPY --from=zip-build /app/onlyoffice-editor.zip.sha512 /
