import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { useState, useEffect } from 'react'

function App() {
  const [mediaData, setMediaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch the media data from the JSON file
    fetch('/media.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch media data')
        }
        return response.json()
      })
      .then(data => {
        setMediaData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading media data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Home
            mediaData={mediaData}
            loading={loading}
            error={error}
          />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App