import { useState } from 'react'

function MediaFile({ file }) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    if (file.type === 'image' || file.type === 'video') {
      setExpanded(!expanded)
    }
  }

  const getFileIcon = () => {
    switch (file.type) {
      case 'video':
        return (
          <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'image':
        return (
          <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  // Render different components based on file type
  const renderFileContent = () => {
    if (!expanded) return null

    switch (file.type) {
      case 'video':
        return (
          <div className="mt-4">
            <video
              className="w-full rounded-lg"
              controls
              poster={`/${file.path.replace(/\.[^/.]+$/, '')}-poster.jpg`}
            >
              <source src={`/${file.path}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )

      case 'image':
        return (
          <div className="mt-4">
            <img
              src={`/${file.path}`}
              alt={file.name}
              className="w-full rounded-lg"
            />
          </div>
        )

      default:
        return null
    }
  }

  const renderDownloadLink = () => {
    if (file.type === 'pdf') {
      return (
        <a
          href={`/${file.path}`}
          download
          className="mt-2 inline-flex items-center text-sm font-medium text-amber-500 hover:text-amber-400"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      )
    }
    return null
  }

  return (
    <div className="bg-neutral-700 rounded-lg overflow-hidden shadow transition-all hover:shadow-lg">
      <div
        className={`p-4 cursor-pointer ${
          (file.type === 'image' || file.type === 'video') ? 'hover:bg-neutral-600' : ''
        }`}
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          {getFileIcon()}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-white">{file.name}</h3>
            {file.description && (
              <p className="text-sm text-neutral-300 mt-1">{file.description}</p>
            )}
            {renderDownloadLink()}
          </div>
        </div>

        {(file.type === 'image' || file.type === 'video') && (
          <div className="mt-2 flex justify-end">
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

      {renderFileContent()}
    </div>
  )
}

export default MediaFile