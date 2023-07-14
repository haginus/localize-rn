import React from 'react';
import './App.css';
import { HeaderBar } from './components/HeaderBar/HeaderBar';
import { TranslatePage } from './pages/translate/TranslatePage';
import { TranslationContext } from './context/TranslationContext';
import { LanguageCode, TranslationFile } from './lib/types';
import { SnackbarProvider } from 'notistack';

function App() {
  const [sourceLanguage, setSourceLanguage] = React.useState<LanguageCode>('en');
  const [translationFile, setTranslationFile] = React.useState<TranslationFile>({});
  const [targetLanguages, setTargetLanguages] = React.useState<LanguageCode[]>([]);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = React.useState<LanguageCode>('ro');
  const [selectedNamespace, setSelectedNamespace] = React.useState<string>('common');
  const [translateApiKey, _setTranslateApiKey] = React.useState<string>(localStorage.getItem('translateApiKey') || '');
  const setTranslateApiKey = React.useCallback((apiKey: string) => {
    localStorage.setItem('translateApiKey', apiKey);
    _setTranslateApiKey(apiKey);
  }, [_setTranslateApiKey]);
 
  return (
    <SnackbarProvider maxSnack={1} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
      <TranslationContext.Provider value={{
        sourceLanguage,
        setSourceLanguage,
        translationFile,
        setTranslationFile,
        targetLanguages,
        setTargetLanguages,
        addTargetLanguage: (language: LanguageCode) => {
          setTargetLanguages([...targetLanguages, language]);
        },
        selectedTargetLanguage,
        setSelectedTargetLanguage,
        selectedNamespace,
        setSelectedNamespace,
        translateApiKey,
        setTranslateApiKey,
      }}>
        <div className="App">
          <HeaderBar />
          <TranslatePage />
        </div>
      </TranslationContext.Provider>
    </SnackbarProvider>
  );
}

export default App;
