import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { Config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8500;
const CONF = process.env.CONF || "./conf.json";

function readConfig() {
  const configObj = JSON.parse(
    fs.readFileSync(CONF, { encoding: "utf8", flag: "r" }),
  );
  const newConfig = new Config(
    configObj.rows,
    configObj.cols,
    configObj.bg,
    configObj.fg,
  );
  for (const action of configObj.actions) {
    newConfig.addAction(
      action.col,
      action.row,
      action.bg,
      action.fg,
      action.name,
      action.icon,
      action.cmd,
    );
  }
  return newConfig;
}

function main() {
  fs.watchFile(CONF, (_curr, _prev) => {
    try {
      const newConfig = readConfig();
      config = newConfig;
      console.log("Config reloaded");
    } catch (err) {
      console.error(err);
    }
  });

  const app = express();
  app.use(cors());

  app.use(express.static(path.resolve(__dirname, "../client/dist")));

  app.get("/api", (_req, res) => {
    res.json({ message: "Hello from server!" });
  });
  app.get("/api/config", (_req, res) => {
    res.json(config);
  });
  app.get("/api/actions", (_req, res) => {
    res.json(config.actions);
  });
  app.get("/api/execute/:id", (req, res) => {
    try {
      const action = config.getAction(req.params.id);
      action.execute();
      res.json({ message: "Success" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

let config;
try {
  config = readConfig();
} catch (err) {
  console.error(err);
  process.exit(1);
}
main();
