import './App.css'
import ActionButton from './components/ActionButton'

function App() {
  return (
    <div className="App m-0 text-center text-slate-100 bg-slate-800">
      <section className="App-actions min-h-screen grid grid-cols-4 grid-rows-3 gap-8 items-center">
        <header className="App-header absolute top-0 left-0">
          { window.location.hostname }
        </header>

        <ActionButton name="Test name" />
        <ActionButton cmd="ls -la" />
        <ActionButton />
        <ActionButton />

        <ActionButton />
        <ActionButton />
        <ActionButton />
        <ActionButton />

        <ActionButton />
        <ActionButton />
        <ActionButton />
        <ActionButton />
      </section>
    </div>
  );
}

export default App;
