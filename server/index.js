import path from "path";
import fs from "fs";
import exec from "child_process";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8500;
const CONF = process.env.CONF || "./conf.json";

class Config {
  rows = 0;
  cols = 0;
  bg = "#000000";
  fg = "#FFFFFF";
  actions = [];

  constructor(rows, cols, bg, fg) {
    this.rows = rows;
    this.cols = cols;
    this.bg = bg;
    this.fg = fg;

    this.actions = new Array(rows * cols);
  }

  addAction(col, row, bg, fg, name, icon, cmd) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      throw new Error("Invalid position");
    }
    const id = row * this.cols + col;
    const action = new Action(id, bg, fg, name, icon, cmd);
    this.actions[id] = action;
  }

  getAction(id) {
    if (id < 0 || id >= this.actions.length) {
      throw new Error("Invalid id");
    }
    return this.actions[id];
  }
}

class Action {
  constructor(id, bg, fg, name, icon, cmd) {
    this.id = id;
    this.bg = bg;
    this.fg = fg;
    this.name = name;
    this.icon = icon;
    this.cmd = cmd;
  }

  execute() {
    exec.exec(this.cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
}

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
      console.error(err);
      res.status(500).send(err.message);
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
