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
const outputPath = path.join(here, "index.html");

async function main() {
  runRendererSelfTests();
  validateResumeData(resume);
  const template = await fs.readFile(templatePath, "utf8");
  const html = renderDocument(resume, "en", template);
  await fs.writeFile(outputPath, `${html}\n`, "utf8");
  console.log(`Generated ${path.relative(process.cwd(), outputPath) || "index.html"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
