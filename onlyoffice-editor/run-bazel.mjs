import { execSync } from "child_process";
import process from "process";

const args = process.argv.slice(2).join(" ");

execSync(args, {
    stdio: "inherit",
});
