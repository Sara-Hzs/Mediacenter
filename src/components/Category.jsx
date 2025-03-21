import { useState, useEffect, useRef } from 'react'
import MediaFile from './MediaFile'

function Category({ category, selectedLanguage, targetFileHash }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const targetFileRef = useRef(null)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Expand category if it contains the target file
  useEffect(() => {
    if (targetFileHash) {
      // Check if this category contains the target file
      const containsTargetFile = checkIfContainsFile(category, targetFileHash)
      if (containsTargetFile) {
        setIsExpanded(true)
      }
    }
  }, [targetFileHash, category])

  // Helper function to check if category contains file
  const checkIfContainsFile = (cat, hash) => {
    // Check files directly in the category
    if (cat.files && Array.isArray(cat.files)) {
      const directMatch = cat.files.some(file => file.hash === hash)
      if (directMatch) return true
    }

    // Check files in subfolders
    if (cat.subfolders && Array.isArray(cat.subfolders)) {
      for (const subfolder of cat.subfolders) {
        // Check files in this subfolder
        if (subfolder.files && Array.isArray(subfolder.files)) {
          const subfolderMatch = subfolder.files.some(file => file.hash === hash)
          if (subfolderMatch) return true
        }

        // Recursively check nested subfolders
        if (subfolder.subfolders && subfolder.subfolders.length > 0) {
          const nestedMatch = checkIfContainsFile(subfolder, hash)
          if (nestedMatch) return true
        }
      }
    }

    return false
  }

// Filter files based on selected language
  const getLanguageFilteredFiles = (filesList) => {
    if (!filesList || !Array.isArray(filesList)) return []

    // If "all" is selected, return all files
    if (selectedLanguage === 'all') {
      return filesList;
    }

    // Otherwise filter by the selected language
    return filesList.filter(file => file.languageCode === selectedLanguage);
  }

  // Filter and process all subfolders recursively
  const processSubfolders = (subfolders) => {
    if (!subfolders || !Array.isArray(subfolders)) return []

    return subfolders.map(subfolder => {
      const processedSubfolders = processSubfolders(subfolder.subfolders)
      const filteredFiles = getLanguageFilteredFiles(subfolder.files)

      return {
        ...subfolder,
        subfolders: processedSubfolders,
        filteredFiles: filteredFiles
      }
    })
  }

  const categoryFiles = getLanguageFilteredFiles(category.files)
  const processedSubfolders = processSubfolders(category.subfolders)

  // Recursively count files in all subfolders
  const countTotalFiles = (subfolder) => {
    if (!subfolder) return 0

    const filesInCurrentFolder = subfolder.filteredFiles ? subfolder.filteredFiles.length : 0
    const filesInSubfolders = subfolder.subfolders ?
      subfolder.subfolders.reduce((total, sub) => total + countTotalFiles(sub), 0) : 0

    return filesInCurrentFolder + filesInSubfolders
  }

  // Calculate total files in all subfolders
  const totalFileCount = categoryFiles.length +
    processedSubfolders.reduce((total, subfolder) => total + countTotalFiles(subfolder), 0)

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

  const renderFilesGrid = (files) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <div
            key={file.hash}
            ref={file.hash === targetFileHash ? targetFileRef : null}

          >
            <MediaFile key={file.hash} file={file} isTarget={file.hash === targetFileHash} />
          </div>
        ))}
      </div>
    );
  }

  // Recursive component to render subfolders at any level
  const RenderSubfolders = ({ subfolders, level = 0 }) => {
    if (!subfolders || subfolders.length === 0) return null;

    return (
      <div className="space-y-8">
        {subfolders.map(subfolder => (
          <div key={subfolder.id} className="subfolder">
            {/* Subfolder header with appropriate size based on level */}
            <div className={`mb-4 border-l-${4-Math.min(level, 3)} border-nomo-${500-level*100} pl-3`}>
              <h3 className={`text-white ${level === 0 ? 'text-lg' : 'text-md'} font-medium`}>
                {subfolder.name}
              </h3>
            </div>

            {/* Files in this subfolder */}
            <div>
              {subfolder.filteredFiles && subfolder.filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subfolder.filteredFiles.map(file => (
                    <div
                      key={file.hash}
                      ref={file.hash === targetFileHash ? targetFileRef : null}

                    >
                      <MediaFile key={file.hash} file={file} isTarget={file.hash === targetFileHash} />
                    </div>
                  ))}
                </div>
              ) : (
                subfolder.subfolders && subfolder.subfolders.length === 0 && (
                  <p className="text-center text-neutral-300 py-2">No files available in the selected language.</p>
                )
              )}

              {/* Render any deeper level subfolders */}
              {subfolder.subfolders && subfolder.subfolders.length > 0 && (
                <div className="mt-6">
                  <RenderSubfolders subfolders={subfolder.subfolders} level={level + 1} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };


  useEffect(() => {
    // If category is expanded and contains the target file, scroll to it
    if (isExpanded && targetFileRef.current && targetFileHash) {
      setTimeout(() => {
        targetFileRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 300)
    }
  }, [isExpanded, targetFileHash])

  return (
    <div className="mb-8 bg-neutral-800 overflow-hidden shadow-lg">
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

          {/* Expand/Collapse Icon */}
          <svg
            className={`ml-auto w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
              <h2 className="text-lg font-bold text-white">
                {category.name}
              </h2>
            </div>

            <div className="flex items-center">
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

      {/* Main Category Content */}
      {isExpanded && (
        <div className="px-6 pt-4 pb-6">
          {/* Main category files (not in subfolders) */}
          {categoryFiles.length > 0 && (
            <div className="mb-8">
              {renderFilesGrid(categoryFiles)}
            </div>
          )}

          {/* All subfolders - recursively rendered and always expanded */}
          {processedSubfolders.length > 0 && (
            <RenderSubfolders subfolders={processedSubfolders} />
          )}

          {/* No files message */}
          {totalFileCount === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-300">No files available in the selected language.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Category