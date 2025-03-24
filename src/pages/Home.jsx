import { useEffect } from 'react'
import { nomoFallbackQRCode } from "nomo-webon-kit"
import Header from '../components/Header'
import Category from '../components/Category'

function Home({
                mediaData,
                loading,
                error,
                selectedLanguage,
                availableLanguages,
                onLanguageChange,
                targetFileHash
              }) {
  useEffect(() => {
    // nomoFallbackQRCode()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nomo-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Media</h2>
          <p className="text-neutral-200">{error}</p>
          <p className="text-neutral-300 mt-4">
            Please make sure the metadata.json file is available in the googleDriveFiles directory.
          </p>
        </div>
      )
    }

    if (!mediaData || !mediaData.categories || mediaData.categories.length === 0) {
      return (
        <div className="bg-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-nomo-500 mb-2">No Media Found</h2>
          <p className="text-neutral-300">
            No media categories were found. Please check the metadata.json file in the googleDriveFiles directory.
          </p>
        </div>
      )
    }

    // Filter out categories with no content for the selected language
    const visibleCategories = mediaData.categories.filter(category => {
      // If we're showing all languages, return all categories
      if (selectedLanguage === 'all') return true;

      // Check if this category has any files in the selected language
      const hasMatchingFiles = checkCategoryForLanguage(category, selectedLanguage);
      return hasMatchingFiles;
    });

    // If no categories have content in the selected language
    if (visibleCategories.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <svg className="w-16 h-16 text-neutral-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-neutral-300 mb-2">No Content Available</h2>
          <p className="text-neutral-400 max-w-md">
            There are no files available in the selected language. Please try selecting a different language.
          </p>
        </div>
      );
    }

    return (
      <>
        {visibleCategories.map(category => (
          <Category
            key={category.id}
            category={category}
            selectedLanguage={selectedLanguage}
            targetFileHash={targetFileHash}
          />
        ))}
      </>
    )
  }

  // Helper function to check if a category has any files in the specified language
  const checkCategoryForLanguage = (category, langCode) => {
    // Check if any direct files match the language
    if (category.files && Array.isArray(category.files)) {
      const hasMatchingFiles = category.files.some(file => file.languageCode === langCode);
      if (hasMatchingFiles) return true;
    }

    // Check subfolders recursively
    if (category.subfolders && Array.isArray(category.subfolders)) {
      for (const subfolder of category.subfolders) {
        // Check files in this subfolder
        if (subfolder.files && Array.isArray(subfolder.files)) {
          const hasMatchingFiles = subfolder.files.some(file => file.languageCode === langCode);
          if (hasMatchingFiles) return true;
        }

        // Check nested subfolders
        if (subfolder.subfolders && subfolder.subfolders.length > 0) {
          for (const nestedSubfolder of subfolder.subfolders) {
            const hasNestedMatches = checkSubfolderForLanguage(nestedSubfolder, langCode);
            if (hasNestedMatches) return true;
          }
        }
      }
    }

    return false;
  }

  // Helper function to check subfolders recursively
  const checkSubfolderForLanguage = (subfolder, langCode) => {
    // Check files in this subfolder
    if (subfolder.files && Array.isArray(subfolder.files)) {
      const hasMatchingFiles = subfolder.files.some(file => file.languageCode === langCode);
      if (hasMatchingFiles) return true;
    }

    // Check nested subfolders
    if (subfolder.subfolders && Array.isArray(subfolder.subfolders)) {
      for (const nestedSubfolder of subfolder.subfolders) {
        const hasNestedMatches = checkSubfolderForLanguage(nestedSubfolder, langCode);
        if (hasNestedMatches) return true;
      }
    }

    return false;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Header
        selectedLanguage={selectedLanguage}
        availableLanguages={availableLanguages}
        onLanguageChange={onLanguageChange}
      />

      <main className="container mx-auto pt-24 pb-12">
        {renderContent()}
      </main>
    </div>
  )
}

export default Home