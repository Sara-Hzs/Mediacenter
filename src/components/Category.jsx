import { useState } from 'react'
import MediaFile from './MediaFile'

function Category({ category }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="mb-8 bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
      {/* Category Header with Banner */}
      <div
        className="relative cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Banner Image (if exists) */}
        {category.bannerImage ? (
          <div className="relative h-40 overflow-hidden">
            <img
              src={`/${category.bannerImage}`}
              alt={`${category.name} banner`}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 h-20"></div>
        )}

        {/* Category Title */}
        <div className={`absolute inset-0 flex items-center ${category.bannerImage ? 'justify-start px-6' : 'justify-center'}`}>
          <h2 className="text-2xl font-bold text-white">
            {category.name}
          </h2>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
      </div>

      {/* Category Description (if exists) */}
      {isExpanded && category.description && (
        <div className="px-6 py-4 bg-neutral-700 border-b border-neutral-600">
          <p className="text-neutral-200">{category.description}</p>
        </div>
      )}

      {/* Files Container */}
      {isExpanded && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.files.map(file => (
            <MediaFile key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Category