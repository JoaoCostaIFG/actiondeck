import 'dotenv/config'
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import { WebSocketServer, WebSocket } from "ws";
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
  const app = express();
  app.use(cors());

  // API endpoints
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

  // frontend endpoints
  app.use(express.static(path.resolve(__dirname, "../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });

  const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  });

  fs.watchFile(CONF, (_curr, _prev) => {
    try {
      const newConfig = readConfig();
      config = newConfig;
      const configString = JSON.stringify(config);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(configString, { binary: false });
        }
      });
      console.log("Config reloaded");
    } catch (err) {
      console.error(err);
    }
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
