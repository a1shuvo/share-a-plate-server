import { readFileSync } from "fs";
const file = "./firebase.json";
const data = readFileSync(file, "utf-8");
console.log(Buffer.from(data).toString("base64"));
