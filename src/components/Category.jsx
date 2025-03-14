import { useState } from 'react'
import MediaFile from './MediaFile'

function Category({ category, selectedLanguage }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Filter files based on selected language, fallback to English if not available
  const getLanguageFilteredFiles = () => {
    if (!category.files || !Array.isArray(category.files)) return []

    // Group files by their name (without language prefix)
    const fileGroups = {}

    category.files.forEach(file => {
      // Get a unique key for the file based on its hash
      const fileKey = file.hash

      if (!fileGroups[fileKey]) {
        fileGroups[fileKey] = []
      }

      fileGroups[fileKey].push(file)
    })

    // For each group, select the file in the preferred language or fallback to English
    const selectedFiles = []

    Object.values(fileGroups).forEach(group => {
      // Try to find file in selected language
      const preferredFile = group.find(file => file.languageCode === selectedLanguage)

      // If not found, try English as fallback
      const englishFile = group.find(file => file.languageCode === 'en')

      // If neither found, use the first file in the group
      const fileToUse = preferredFile || englishFile || group[0]

      if (fileToUse) {
        selectedFiles.push(fileToUse)
      }
    })

    return selectedFiles
  }

  const filteredFiles = getLanguageFilteredFiles()

  // Get icon based on category
  const getCategoryIcon = () => {
    if (category.icon) {
      return (
        <img
          src={`/${category.icon}`}
          alt={`${category.name} icon`}
          className="w-8 h-8 mr-3 flex-shrink-0"
        />
      )
    }

    // Default icon if no category icon is specified
    return (
      <svg className="w-8 h-8 mr-3 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }

  return (
    <div className="mb-8 bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
      {/* Category Header */}
      <div
        className="relative p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Desktop layout (md and up) */}
        <div className="hidden md:flex md:items-center">
          {/* Category Icon */}
          {getCategoryIcon()}

          {/* Category Title */}
          <h2 className="text-2xl font-bold text-white">
            {category.name}
          </h2>

          {/* File count badge */}
          <span className="ml-auto mr-8 bg-nomo-500 text-black px-2 py-1 rounded-full text-sm font-medium">
            {filteredFiles.length} files
          </span>

          {/* Expand/Collapse Icon */}
          <svg
            className={`w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Mobile layout (sm and down) */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center mr-2">
              {/* Category Icon */}
              {getCategoryIcon()}

              {/* Category Title - with truncation for very small screens */}
              <h2 className="text-xl font-bold text-white truncate">
                {category.name}
              </h2>
            </div>

            <div className="flex items-center">
              {/* File count badge */}
              <span className="mr-3 bg-nomo-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                {filteredFiles.length} files
              </span>

              {/* Expand/Collapse Icon */}
              <svg
                className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Description (if exists) */}
      {isExpanded && category.description && (
        <div className="px-6 py-4 bg-neutral-700 border-b border-neutral-600">
          <p className="text-neutral-200">{category.description}</p>
        </div>
      )}

      {/* Files Container */}
      {isExpanded && filteredFiles.length > 0 && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map(file => (
            <MediaFile key={file.hash} file={file} />
          ))}
        </div>
      )}

      {/* No files message */}
      {isExpanded && filteredFiles.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-neutral-300">No files available in the selected language.</p>
        </div>
      )}
    </div>
  )
}

export default Category