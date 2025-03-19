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

    return (
      <>
        {mediaData.categories.map(category => (
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