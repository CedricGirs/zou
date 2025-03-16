
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import translations, { TranslationKey } from '../translations';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  
  // Provide a type-safe translation function
  const translate = (key: TranslationKey): string => {
    return context.t(key);
  };

  return {
    ...context,
    t: translate
  };
};

export default useTranslation;
