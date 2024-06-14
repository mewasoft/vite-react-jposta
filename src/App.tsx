import {FormEventHandler, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Address, getAddress } from 'jposta'

function App() {
  const [result, setResult] = useState<Address|null>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const zipCode = form.get('zipCode') as string
    const address = await getAddress(zipCode)
    setResult(address)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + jposta</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="zipCode"/>
        <button type="submit">search</button>
      </form>
      <div className="card">
        result: {JSON.stringify(result, null, 2)}
      </div>
    </>
  )
}

export default App
