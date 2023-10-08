import './App.css'
import ActionButton from './components/ActionButton'
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 0,
      cols: 0,
      actions: [],
    };
  }

  setConfig(config) {
    const actions = [];
    let idx = 0;
    config.actions.forEach(aData => {
      let action;
      if (aData === null) {
        const id = -(idx + config.rows * config.cols);
        action = <ActionButton key={id} id={id} name="" />;
      } else {
        action = <ActionButton key={aData.id} id={aData.id} name={aData.name} icon={aData.icon} />;
      }
      actions.push(action);
      ++idx;
    });

    this.setState({
      rows: config.rows,
      cols: config.cols,
      actions: actions,
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
      <div className="App m-0 text-center text-slate-100 bg-slate-800">
        <div className="App-actions h-screen p-10 grid gap-8 items-center justify-items-center" style={{
            gridTemplateColumns: `repeat(${this.state.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${this.state.rows}, minmax(0, 1fr))`,
        }}>
          {this.state.actions}
        </div>
      </div>
    );

    return ret;
  }
}

export default App;
