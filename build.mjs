import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  renderDocument,
  runRendererSelfTests,
  validateResumeData,
} from "./renderer.mjs";
import { resume } from "./resume-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(here, "index.template.html");
const outputs = [
  { file: "index.html", lang: "en", path: "/" },
  { file: "en.html", lang: "en", path: "/en.html" },
  { file: "ru.html", lang: "ru", path: "/ru.html" },
];

async function main() {
  runRendererSelfTests();
  validateResumeData(resume);
  const template = await fs.readFile(templatePath, "utf8");
  for (const output of outputs) {
    const outputPath = path.join(here, output.file);
    const html = renderDocument(resume, output.lang, template, { path: output.path });
    await fs.writeFile(outputPath, `${html}\n`, "utf8");
    console.log(`Generated ${path.relative(process.cwd(), outputPath) || output.file}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
