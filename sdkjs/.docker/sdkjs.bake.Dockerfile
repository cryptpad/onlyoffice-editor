# ==============================================================================
# MODULE DOCKERFILE
# This file is not meant to be built standalone. It is consumed by the 
# docker-bake.hcl files in the parent monorepos.
#
# REQUIRED CONTEXTS:
# - core-wasm: builds from core-wasm in core repository
# ==============================================================================

ARG PRODUCT_VERSION
ARG BUILD_ROOT

#### BASE ####
FROM ubuntu:24.04 AS web-base
    RUN apt-get update && \
        apt-get install -y ca-certificates curl gnupg openjdk-21-jdk wget zip brotli bzip2 && \
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
        apt-get install -y nodejs && \
        npm install -g @yao-pkg/pkg grunt-cli && \
        rm -rf /var/lib/apt/lists/*

#### SDKJS ####
FROM web-base AS sdkjs-base

    ARG BUILD_ROOT=/package

    ARG PRODUCT_VERSION

    COPY sdkjs/build/package*.json /app/build/

    RUN --mount=type=cache,target=/root/.npm \
        cd app/build && \
        npm install

    COPY sdkjs/ /app
    COPY sdkjs-forms/ /sdkjs-forms

    ENV BUILD_ROOT=${BUILD_ROOT}

    ENV PRODUCT_VERSION=${PRODUCT_VERSION}

    ## Copy core wasm builds
    COPY --from=core-wasm ${BUILD_ROOT}/engine/ /app/pdf/src/engine/
    COPY --from=core-wasm ${BUILD_ROOT}/zlib/ /app/common/zlib/
    COPY --from=core-wasm ${BUILD_ROOT}/hash/ /app/common/hash/
    COPY --from=core-wasm ${BUILD_ROOT}/spell/ /app/common/spell/
    COPY --from=core-wasm ${BUILD_ROOT}/libfont/ /app/common/libfont/

FROM sdkjs-base AS sdkjs-desktop
    ARG TARGETARCH
    RUN cd app/build && \
        CC_PLATFORM=$(if [ "$TARGETARCH" = "arm64" ]; then echo "java"; else echo "native,java"; fi) grunt --addon=sdkjs-forms --desktop=true

FROM sdkjs-base AS sdkjs
    ARG TARGETARCH
    RUN cd app/build && \
        CC_PLATFORM=$(if [ "$TARGETARCH" = "arm64" ]; then echo "java"; else echo "native,java"; fi) grunt --addon=sdkjs-forms