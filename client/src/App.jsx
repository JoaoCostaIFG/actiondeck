import ActionButton from './components/ActionButton'
import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Color from 'color';

const defaultBg = "#1e293b";
const defaultFg = "#f1f5f9";

function App(props) {
  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [actions, setActions] = useState([]);
  const [fg, setFg] = useState(Color(defaultFg));
  const [bg, setBg] = useState(Color(defaultBg));

  const { sendMessage, lastMessage, readyState } =
    useWebSocket(`ws://${window.location.hostname}:${import.meta.env.VITE_SERVER_PORT ?? window.location.port}`, {
      onOpen: () => console.log('Opened WS to server'),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (_closeEvent) => true,
    });

  const setConfig = (config) => {
    const newActions = config.actions.map((aData, idx) => {
      if (aData === null) {
        return <ActionButton key={idx} id={idx} isDisabled={true} />;
      }
      return <ActionButton key={aData.id} id={aData.id} isDisabled={false} name={aData.name} icon={aData.icon} fg={aData.fg} bg={aData.bg} />;
    });

    setRows(config.rows);
    setCols(config.cols);
    setActions(newActions);
    setFg(new Color(config.fg));
    setBg(new Color(config.bg));
  }

  useEffect(() => {
    if (lastMessage !== null) {
      setConfig(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);


  useEffect(() => {
    fetch("/api/config")
      .then(async (res) => {
        const config = await res.json();
        setConfig(config)
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App m-0 text-center" style={{ backgroundColor: bg.hex(), color: fg.hex() }}>
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
