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
    // Fetch the metadata.json from googleDriveFiles instead of media.json
    const fetchMedia = fetch('/googleDriveFiles/metadata.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch metadata')
        }
        return response.json()
      })
      .then(data => {
        // Convert to the format expected by the rest of the application
        return {
          files: data // The metadata.json is already an array of files
        }
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

          // Sort languages with English first, then alphabetically by name
          languages.sort((a, b) => {
            if (a.code === 'en') return -1;
            if (b.code === 'en') return 1;
            return a.name.localeCompare(b.name);
          });

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

  // Process the data to organize files by categories and subcategories with support for multiple levels
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

      // Use the first entry in the folderLocation array as the category
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
          subfolders: {},
          files: []
        }
      }

      if (file.folderLocation.length === 1) {
        // File is directly in the main category
        categoriesMap[categoryName].files.push(file)
      } else {
        // File is in a subfolder structure
        let currentLevel = categoriesMap[categoryName].subfolders
        let parentPath = categoryName

        // Process all subfolder levels except the last one (which contains the file)
        for (let i = 1; i < file.folderLocation.length; i++) {
          const folderName = file.folderLocation[i]
          parentPath = `${parentPath}/${folderName}`

          if (!currentLevel[parentPath]) {
            currentLevel[parentPath] = {
              id: parentPath.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              name: folderName,
              path: parentPath,
              level: i,
              subfolders: {},
              files: []
            }
          }

          // Add file to the current subfolder level
          if (i === file.folderLocation.length - 1) {
            currentLevel[parentPath].files.push(file)
          } else {
            // Move to next level of subfolders
            currentLevel = currentLevel[parentPath].subfolders
          }
        }
      }
    })

    // Convert subfolder maps to arrays at all levels
    const processSubfolders = (folder) => {
      if (folder.subfolders && Object.keys(folder.subfolders).length > 0) {
        // Process each subfolder
        Object.values(folder.subfolders).forEach(subfolder => {
          processSubfolders(subfolder)
        })

        // Convert subfolders object to array and sort by name
        folder.subfolders = Object.values(folder.subfolders)
          .sort((a, b) => a.name.localeCompare(b.name))
      }
    }

    // Process each category
    Object.values(categoriesMap).forEach(category => {
      processSubfolders(category)
      // Convert top-level subfolders to array
      category.subfolders = Object.values(category.subfolders)
        .sort((a, b) => a.name.localeCompare(b.name))
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