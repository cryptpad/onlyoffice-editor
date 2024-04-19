const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        library: {
            amdContainer: "window",
            type: "amd", // or 'amd-require'
        },
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
