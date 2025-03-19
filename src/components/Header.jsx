import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import LanguageSelector from './LanguageSelector'

function Header({ selectedLanguage, availableLanguages, onLanguageChange, userStatus = {} }) {
  const [scrolled, setScrolled] = useState(false)
  const { isPromoter } = userStatus || {}

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-neutral-900/95 shadow-md' : 'bg-neutral-900'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Media Center Logo"
            className="h-10 mr-3"
          />
          <h1 className="text-xl font-semibold text-nomo-500">
            Media Center
          </h1>
        </div>

        <div className="flex items-center">
          {/* Promoter Badge */}
          {isPromoter && (
            <div className="hidden md:flex items-center mr-4">
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-nomo-500 text-black">
                VOO Promoter
              </div>
            </div>
          )}

          <LanguageSelector
            selectedLanguage={selectedLanguage}
            availableLanguages={availableLanguages}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  )
}

export default Header