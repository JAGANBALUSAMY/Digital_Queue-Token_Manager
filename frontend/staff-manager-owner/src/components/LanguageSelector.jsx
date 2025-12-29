import React, { useState } from 'react';

const LanguageSelector = () => {
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'Hindi'];

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // You can add language change logic here when i18n is implemented
  };

  return (
    <select 
      value={language} 
      onChange={handleLanguageChange}
      className="language-selector"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;