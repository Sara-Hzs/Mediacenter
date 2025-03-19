import React from 'react'

function UserStatusBanner({ userStatus }) {
  const { isMember, isPromoter } = userStatus

  // If neither a member nor promoter, don't show the banner
  if (!isMember && !isPromoter) {
    return null
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 border border-nomo-500/30 shadow-lg">
      <div className="flex items-center">
        {/* Badge/Icon */}
        <div className="flex-shrink-0 mr-4">
          {isPromoter ? (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nomo-400 to-nomo-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nomo-300 to-nomo-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          )}
        </div>

        {/* Status Text */}
        <div>
          <h2 className="text-xl font-bold text-nomo-400">
            {isPromoter ? 'Promoter' : 'Member'}
          </h2>
          <p className="text-neutral-300">
            {isPromoter
              ? 'You have promoter status and access to all content in the Media Center.'
              : 'You have member status but need promoter status to access all media content.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserStatusBanner