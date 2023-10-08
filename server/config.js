import exec from "child_process";

export class Config {
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

export class Action {
  constructor(id, bg, fg, name, icon, cmd) {
    this.id = id;
    this.bg = bg;
    this.fg = fg;
    this.name = name;
    this.icon = icon;
    this.cmd = cmd;
  }

  execute() {
    const p = exec.spawn(this.cmd, [], {detached: true, stdio: 'ignore', shell: true});
    p.unref();
  }
}

