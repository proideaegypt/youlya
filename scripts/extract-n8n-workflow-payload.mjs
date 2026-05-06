import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const backupPath = path.join(projectRoot, "n8n", "backups", "workflow-joqfame4HXG775JO-haidi-openai.json");
const backup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

// Extract core workflow fields for API update
const workflowUpdate = {
  name: backup.name,
  nodes: backup.nodes,
  connections: backup.connections,
  settings: backup.settings,
};

const outputPath = path.join(projectRoot, "n8n", "backups", "workflow-joqfame4HXG775JO-update-payload.json");
fs.writeFileSync(outputPath, JSON.stringify(workflowUpdate, null, 2));
console.log("✅ Extracted workflow update payload:", outputPath);
