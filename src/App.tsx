import {FormEventHandler, useState, ChangeEventHandler, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Address, City, getAddress, getCitiesByPref, getPrefs } from 'jposta'

function App() {
  const [addressResult, setAddressResult] = useState<Address|null>(null)
  const [citiesResult, setCitiesResult] = useState<City[]>([])
  const [selectedPref, setSelectedPref] = useState<number>(13) // Default to Tokyo
  const [loading, setLoading] = useState<boolean>(false)

  const handleAddressSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)
    const form = new FormData(event.currentTarget)
    const zipCode = form.get('zipCode') as string
    try {
      const address = await getAddress(zipCode)
      setAddressResult(address)
    } catch (error) {
      console.error('Error fetching address:', error)
      setAddressResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handlePrefChange: ChangeEventHandler<HTMLSelectElement> = async (event) => {
    const prefIndex = parseInt(event.target.value)
    setSelectedPref(prefIndex)
    setLoading(true)
    try {
      const cities = await getCitiesByPref(prefIndex)
      setCitiesResult(cities)
    } catch (error) {
      console.error('Error fetching cities:', error)
      setCitiesResult([])
    } finally {
      setLoading(false)
    }
  }

  // Load default cities (Tokyo) on mount
  useEffect(() => {
    getCitiesByPref(13).then(setCitiesResult)
  }, [])

  const prefectures = getPrefs()

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
      <h1>Vite + React + Enhanced jposta</h1>

      <div className="card">
        <h2>🔍 Address Lookup (Enhanced)</h2>
        <form onSubmit={handleAddressSubmit}>
          <input
            type="text"
            name="zipCode"
            placeholder="Enter postal code (e.g., 100-0001 or 1000001)"
            style={{width: '300px', marginRight: '10px'}}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Address'}
          </button>
        </form>
        {addressResult && (
          <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px'}}>
            <h4>✅ Address Result (with cityCode):</h4>
            <pre style={{fontSize: '12px', whiteSpace: 'pre-wrap'}}>
{JSON.stringify(addressResult, null, 2)}
            </pre>
            <div style={{marginTop: '10px'}}>
              <strong>🆕 City Code:</strong> {addressResult.cityCode} |
              <strong> City:</strong> {addressResult.city} |
              <strong> Prefecture:</strong> {addressResult.pref} ({addressResult.prefNum})
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🏙️ Cities by Prefecture (New Feature)</h2>
        <div style={{marginBottom: '15px'}}>
          <label htmlFor="prefecture" style={{marginRight: '10px'}}>Select Prefecture:</label>
          <select
            id="prefecture"
            value={selectedPref}
            onChange={handlePrefChange}
            disabled={loading}
            style={{padding: '5px', marginRight: '10px'}}
          >
            {prefectures.map((pref: any, index) => (
              <option key={index + 1} value={index + 1}>
                {typeof pref === 'object' ? pref.name : pref}
              </option>
            ))}
          </select>
          {loading && <span>Loading cities...</span>}
        </div>

        {citiesResult.length > 0 && (
          <div>
            <h4>Cities in {typeof prefectures[selectedPref - 1] === 'object' ? (prefectures[selectedPref - 1] as any)?.name : prefectures[selectedPref - 1]} ({citiesResult.length} cities):</h4>
            <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px'}}>
              {citiesResult.map((city: City) => (
                <div key={city.key} style={{padding: '5px', borderBottom: '1px solid #eee'}}>
                  <strong>🔑 Code {city.key}:</strong> {city.name}
                </div>
              ))}
            </div>
            <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
              <strong>✨ New Feature:</strong> Cities are returned as objects with {`{key: number, name: string}`} structure
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>📋 Test Instructions</h3>
        <ul style={{textAlign: 'left', fontSize: '14px'}}>
          <li><strong>Address Lookup:</strong> Try postal codes like "100-0001", "530-0001", or "060-0001"</li>
          <li><strong>Cities by Prefecture:</strong> Select different prefectures to see city codes and names</li>
          <li><strong>Notice:</strong> Address results now include <code>cityCode</code> field</li>
          <li><strong>Notice:</strong> Cities are returned as objects with <code>key</code> and <code>name</code> properties</li>
        </ul>
      </div>
    </>
  )
}

export default App
