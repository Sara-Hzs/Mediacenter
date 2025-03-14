function LanguageSelector({ availableLanguages, selectedLanguage, onLanguageChange }) {
  return (
    <div className="flex items-center">
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-neutral-700 text-white border border-neutral-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-nomo-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector