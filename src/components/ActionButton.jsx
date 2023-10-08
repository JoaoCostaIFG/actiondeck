import React from "react";

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name ?? "",
      icon: this.props.icon ?? "❤️",
      cmd: this.props.cmd ?? "",
      isDisabled: !this.props.cmd ? true : false,
    };
  }

  execute() {
    if (this.state.isDisabled) return;
    console.log(`Executing ${this.state.cmd}`);
  }

  render() {
    return (
      <button disabled={this.state.isDisabled} className="ActionButton relative aspect-square text-center rounded-md border border-solid border-slate-400 shadow-xl bg-violet-700 disabled:bg-transparent" onClick={() => this.execute()}>
        <span className="absolute top-0 left-0 w-full">{this.props.name}</span>
        {this.state.icon}
      </button>
    );
  }
}
