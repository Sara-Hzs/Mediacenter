import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'

function App() {
  const [mediaData, setMediaData] = useState(null)
  const [categoriesData, setCategoriesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en') // Default to English
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: 'en', name: 'English' }
  ])

  useEffect(() => {
    // Fetch the media data from the JSON file
    const fetchMedia = fetch('/media.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch media data')
        }
        return response.json()
      })

    // Fetch the categories data from the JSON file
    const fetchCategories = fetch('/categories.json')
      .then(response => {
        if (!response.ok) {
          // If categories.json doesn't exist yet, don't throw an error
          return { categories: [] }
        }
        return response.json()
      })
      .catch(() => {
        // If categories.json doesn't exist yet, provide empty categories
        console.warn('categories.json not found, using empty categories')
        return { categories: [] }
      })

    // Wait for both fetches to complete
    Promise.all([fetchMedia, fetchCategories])
      .then(([mediaData, categoriesData]) => {
        setMediaData(mediaData)
        setCategoriesData(categoriesData)

        // Extract available languages from the data
        if (mediaData.files && Array.isArray(mediaData.files)) {
          const languageCodes = new Set()

          // Add all language codes from files
          mediaData.files.forEach(file => {
            if (file.languageCode) {
              languageCodes.add(file.languageCode)
            }
          })

          // Convert to array of language objects
          const languages = Array.from(languageCodes).map(code => {
            const languageNames = {
              'en': 'English',
              'de': 'Deutsch',
              'es': 'Español',
              'fr': 'Français',
              'it': 'Italiano',
              // Add more languages as needed
            }

            return {
              code,
              name: languageNames[code] || code.toUpperCase()
            }
          })

          // Ensure English is always available
          if (!languageCodes.has('en')) {
            languages.unshift({ code: 'en', name: 'English' })
          }

          setAvailableLanguages(languages)
        }

        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Process the data to organize files by categories
  const processMediaData = () => {
    if (!mediaData || !mediaData.files || !Array.isArray(mediaData.files)) {
      return { categories: [] }
    }

    // Group files by their category (first folder in folderLocation)
    const categoriesMap = {}

    mediaData.files.forEach(file => {
      if (!file.folderLocation || !Array.isArray(file.folderLocation) || file.folderLocation.length === 0) {
        // Skip files without a valid folder location
        return
      }

      const categoryName = file.folderLocation[0]

      if (!categoriesMap[categoryName]) {
        // Look for category in categoriesData
        const categoryInfo = categoriesData && categoriesData.categories
          ? categoriesData.categories.find(cat => cat.id === categoryName || cat.name === categoryName)
          : null

        categoriesMap[categoryName] = {
          id: categoryName.toLowerCase().replace(/\s+/g, '-'),
          name: categoryName,
          // Add icon and description if they exist in categoriesData
          icon: categoryInfo?.icon || null,
          description: categoryInfo?.description || null,
          files: []
        }
      }

      categoriesMap[categoryName].files.push(file)
    })

    return {
      categories: Object.values(categoriesMap)
    }
  }

  const processedData = processMediaData()

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Home
            mediaData={processedData}
            loading={loading}
            error={error}
            selectedLanguage={selectedLanguage}
            availableLanguages={availableLanguages}
            onLanguageChange={handleLanguageChange}
          />
        } />
      </Routes>
    </BrowserRouter>
  )
}
export default App