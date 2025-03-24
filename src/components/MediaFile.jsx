import { useState, useEffect } from 'react'
import { nomo } from 'nomo-webon-kit'

function MediaFile({ file, isTarget, selectedLanguage  }) {
  const [expanded, setExpanded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLanguageFlag = () => {
    // Only show language flag when language code exists
    if (!file.languageCode) return null;

    // Map of language codes to flag emojis
    const languageFlags = {
      'en': '🇬🇧',
      'de': '🇩🇪',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'it': '🇮🇹',
    };

    // Get flag emoji or use language code as fallback
    const flag = languageFlags[file.languageCode] || file.languageCode.toUpperCase();

    return flag;
  };

  // Determine file type based on file extension
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image'
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) return 'video'
    if (extension === 'link') return 'externalLink'
    if (extension === 'pdf') return 'pdf'
    return 'document'
  }

  // Get file name without language code prefix
  const getDisplayName = (fullFileName) => {
    // Remove language code prefix if present (e.g., "en_" from "en_Instructions.pdf")
    const nameParts = fullFileName.split('_')
    if (nameParts.length > 1 && nameParts[0].length === 2) {
      return nameParts.slice(1).join('_')
    }
    return fullFileName
  }

  // Get file path based on the new structure (hash-based in googleDriveFiles folder)
  const getFilePath = () => {
    if (file.hash) {
      // Extract the file extension from fullFileName
      const extension = file.fullFileName.split('.').pop().toLowerCase();
      // Files are stored directly in the googleDriveFiles directory with their hash as the filename + appropriate extension
      return `/files/${file.hash}.${extension}`
    }

    // Fallback to the old path structure if hash is not available
    if (!file.folderLocation || !Array.isArray(file.folderLocation)) {
      return file.fullFileName
    }
    return [...file.folderLocation, file.fullFileName].join('/')
  }

  const fileType = getFileType(file.fullFileName)
  const displayName = getDisplayName(file.fullFileName)
  const filePath = getFilePath()

  const getFileIcon = () => {
    switch (fileType) {
      case 'video':
        return (
          <svg className="w-8 h-8 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-8 h-8 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'externalLink':
        return (
          <svg className="w-8 h-8 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  // Render different components based on file type
  const renderFileContent = () => {
    if (!expanded) return null

    // Only handle images for inline display
    if (fileType === 'image') {
      return (
        <div className="mt-2 md:mt-3">
          <img
            src={`/${filePath}`}
            alt={displayName}
            className="w-full rounded-lg"
          />
        </div>
      )
    }

    return null
  }

  // Handle file click
  const handleFileClick = async () => {
    if (fileType === 'image') {
      setExpanded(!expanded);
      return;
    }

    if (fileType === 'externalLink') {
      try {
        const response = await fetch(filePath);
        const link = await response.text();
        await nomo.launchUrl({
          url: link.trim(),
          launchMode: 'externalApplication'
        });
      } catch (err) {
        console.error("Failed to open .link file:", err);
      }
      return;
    }

    // Default behavior for other types
    await nomo.launchUrl({
      url: `https://mediacenter.nomo.zone/${filePath}`,
      launchMode: 'externalApplication'
    });
  };


  return (
    <div
      className={`bg-neutral-700 rounded-lg overflow-hidden shadow transition-all hover:shadow-lg ${
        isTarget ? 'ring-2 ring-nomo-500' : ''
      } cursor-pointer hover:bg-neutral-600 h-16 flex`}
      onClick={handleFileClick}
    >
      <div className="px-4 flex items-center justify-center w-full">
        <div className="flex items-center w-full">
          {/* File icon */}
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>

          {/* Language flag - moved between icon and title */}
          {selectedLanguage === 'all' && file.languageCode && (
            <div className="ml-2 mr-2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-neutral-700 text-neutral-200 border border-neutral-600">
                {getLanguageFlag()}
              </span>
            </div>
          )}


          <div className="ml-2 flex-1 min-w-0 flex items-center">
            <h3 className="text-base font-medium text-white break-words hyphens-auto w-full">
              {isDesktop
                ? (displayName.length > 40 ? displayName.substring(0, 40) + "..." : displayName)
                : (displayName.length > 20 ? displayName.substring(0, 20) + "..." : displayName)
              }
            </h3>
          </div>

          {/* Download or external link icon positioned to the right */}
          <div className="ml-2 flex-shrink-0">
            {fileType === 'pdf' || fileType === 'document' || fileType === 'video' ? (
              <svg className="w-5 h-5 text-nomo-500 hover:text-nomo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            ) : fileType === 'externalLink' ? (
              <svg className="w-5 h-5 text-nomo-500 hover:text-nomo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            ) : null}
          </div>
        </div>
      </div>

      {expanded && renderFileContent()}
    </div>
  )
}

export default MediaFile