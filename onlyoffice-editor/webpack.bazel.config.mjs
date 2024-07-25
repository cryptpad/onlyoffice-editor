import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    resolve: {
        extensions: [".js"],
    },
    output: {
        // library: {
        //     name: "DocsAPIXXX", // TODO is there a way, to not expose anything at all?
        //     type: "window",
        // },
        filename: "api.js",
        path: path.resolve(__dirname),
    },
};
