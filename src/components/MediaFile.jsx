import { useState } from 'react'

function MediaFile({ file, userStatus = {} }) {

  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    if (file.type === 'image' || file.type === 'video') {
      setExpanded(!expanded)
    }
  }

  const { isPromoter } = userStatus || {}

  const isFileAccessible = () => {
    console.log("Checking file access for:", file.fullFileName, "User is promoter?", isPromoter);

    if (file.folderLocation && file.folderLocation.length >= 2) {
      const subfolderPath = file.folderLocation.slice(1).join('/');

      const protectedFolders = [
        'Whitepaper',
        'Promoter Materials',
        'Internal'
      ];

      if (protectedFolders.some(folder => subfolderPath.includes(folder))) {
        console.warn("❌ Access Denied for:", file.fullFileName);
        return false;  // ✅ Restrict access if the user is NOT a promoter
      }
    }

    return true;  // ✅ Allow access if not in a protected folder
  };

  // 🚀 NEW: Completely hide restricted files instead of showing them
  if (!isFileAccessible()) {
    return null;  // ✅ Restricted files will not render at all
  }

  // Determine file type based on file extension
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image'
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) return 'video'
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
      return `/googleDriveFiles/${file.hash}.${extension}`
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
          <svg className="w-10 h-10 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-10 h-10 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-10 h-10 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-10 h-10 text-nomo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
    }
  }
  if (!isFileAccessible()) {
    return (
      <div className="bg-neutral-700 rounded-lg overflow-hidden shadow">
        <div className="p-4">
          <div className="flex items-start">
            <div className="pt-1">
              {getFileIcon()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">{displayName}</h3>
              <div className="mt-2">
                <span className="text-xs bg-red-800 text-white px-2 py-1 rounded">
                  Restricted Content – Promoters Only
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Render different components based on file type
  const renderFileContent = () => {
    if (!expanded) return null

    switch (fileType) {
      case 'video':
        return (
          <div className="mt-4">
            <video
              className="w-full rounded-lg"
              controls
              poster={`/${filePath.replace(/\.[^/.]+$/, '')}-poster.jpg`}
            >
              <source src={`/${filePath}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )

      case 'image':
        return (
          <div className="mt-4">
            <img
              src={`/${filePath}`}
              alt={displayName}
              className="w-full rounded-lg"
            />
          </div>
        )

      default:
        return null
    }
  }

  const renderDownloadLink = () => {
    if (fileType === 'pdf' || fileType === 'document') {
      return (
        <a
          href={filePath}
          download
          className="flex justify-center mt-1 w-fill items-center text-sm font-medium text-nomo-500 hover:text-nomo-400"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download {fileType.toUpperCase()}
        </a>
      )
    }
    return null
  }

  return (
    <div className="bg-neutral-700 rounded-lg overflow-hidden shadow transition-all hover:shadow-lg">
      <div
        className={`p-4 ${
          (fileType === 'image' || fileType === 'video') ? 'cursor-pointer hover:bg-neutral-600' : ''
        }`}
        onClick={(fileType === 'image' || fileType === 'video') ? toggleExpand : undefined}
      >
        <div className="flex items-start">
          {/* Fixed size icon */}
          <div className="pt-1">
            {getFileIcon()}
          </div>

          <div className="ml-4 flex-1 min-w-0">
            {/* Title with word-wrap instead of truncation */}
            <h3 className="text-lg font-medium text-white break-words hyphens-auto">
              {displayName}
            </h3>

            {/*/!* Language badge *!/*/}
            {/*<div className="mt-2">*/}
            {/*  <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">*/}
            {/*    {file.languageCode.toUpperCase()}*/}
            {/*  </span>*/}
            {/*</div>*/}

            {/* View toggle for media files */}
            {(fileType === 'image' || fileType === 'video') && (
              <div className="mt-2">
                <button
                  className="text-neutral-300 hover:text-white text-sm flex items-center"
                >
                  {expanded ? 'Hide' : 'View'}
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}

          </div>
        </div>
        <div className="mt-2">
          {renderDownloadLink()}
        </div>
      </div>

      {renderFileContent()}
    </div>
  )
}

export default MediaFile