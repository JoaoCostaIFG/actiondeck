import ActionButton from './components/ActionButton'
import React from "react";
import Color from 'color';

const defaultBg = "#1e293b";
const defaultFg = "#f1f5f9";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 0,
      cols: 0,
      actions: [],
      fg: Color(this.props.fg ?? defaultFg),
      bg: Color(this.props.bg ?? defaultBg),
    };
  }

  setConfig(config) {
    const actions = [];
    let idx = 0;
    config.actions.forEach(aData => {
      let action;
      if (aData === null) {
        const id = -(idx + config.rows * config.cols);
        action = <ActionButton key={id} id={id} />;
      } else {
        action = <ActionButton key={aData.id} id={aData.id} name={aData.name} icon={aData.icon} fg={aData.fg} bg={aData.bg} />;
      }
      actions.push(action);
      ++idx;
    });

    this.setState({
      rows: config.rows,
      cols: config.cols,
      actions: actions,
      fg: Color(config.fg ?? defaultFg),
      bg: Color(config.bg ?? defaultBg),
    });
  }

  componentDidMount() {
    fetch("/api/config")
      .then(async (res) => {
        const config = await res.json();
        this.setConfig(config)
      })
      .catch((err) => console.error(err));
  }

  render() {
    const ret = (
      <div className="App m-0 text-center" style={{backgroundColor: this.state.bg.hex(), color: this.state.fg.hex()}}>
        <div
          className="App-actions h-screen p-2 md:p-4 lg:p-10 grid gap-1 md:gap-4 lg:gap-8 items-center justify-items-center"
          style={{
            gridTemplateColumns: `repeat(${this.state.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${this.state.rows}, minmax(0, 1fr))`,
          }}
        >
          {this.state.actions}
        </div>
      </div>
    );

    return ret;
  }
}

export default App;
