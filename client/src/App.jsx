import ActionButton from './components/ActionButton'
import React, { useState, useEffect } from "react";
import Color from 'color';

const defaultBg = "#1e293b";
const defaultFg = "#f1f5f9";

function App(props) {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [actions, setActions] = useState([]);
  const [fg, setFg] = useState(Color(defaultFg));
  const [bg, setBg] = useState(Color(defaultBg));

  const setConfig = (config) => {
    const newActions = [];
    let idx = 0;
    config.actions.forEach(aData => {
      let action;
      if (aData === null) {
        const id = -(idx + config.rows * config.cols);
        action = <ActionButton key={id} id={id} />;
      } else {
        action = <ActionButton key={aData.id} id={aData.id} name={aData.name} icon={aData.icon} fg={aData.fg} bg={aData.bg} />;
      }
      newActions.push(action);
      ++idx;
    });

    setRows(config.rows);
    setCols(config.cols);
    setActions(newActions);
    setFg(new Color(config.fg));
    setBg(new Color(config.bg));
  }

  useEffect(() => {
    fetch("/api/config")
      .then(async (res) => {
        const config = await res.json();
        setConfig(config)
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App m-0 text-center" style={{backgroundColor: bg.hex(), color: fg.hex()}}>
      <div
        className="App-actions h-screen p-2 md:p-4 lg:p-10 grid gap-1 md:gap-4 lg:gap-8 items-center justify-items-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {actions}
      </div>
    </div>
  );
}


export default App;
