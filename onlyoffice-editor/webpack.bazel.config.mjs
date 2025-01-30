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
        filename: "api.js",
        path: path.resolve(__dirname),
    },
};
