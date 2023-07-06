import React from 'react';
import './App.css';
import { HeaderBar } from './components/HeaderBar/HeaderBar';
import { TranslatePage } from './pages/translate/TranslatePage';
import { TranslationContext } from './context/TranslationContext';
import { LanguageCode, TranslationFile } from './lib/types';

function App() {
  const [sourceLanguage, setSourceLanguage] = React.useState<LanguageCode>('en');
  const [translationFile, setTranslationFile] = React.useState<TranslationFile>({
    en: {
      common: {
        hello: 'Hello everyone!',
        world: 'World',
        nested_a: {
          nested_b: {
            test: 'Test',
            test2: 'Test',
            nested_c: {
              test3: '',
            }
          },
        },
      },
    },
    ro: {
      common: {
        hello: 'buna ziua tuturor!',
        world: '',
        nested_a: {
          nested_b: {
            test: '',
            test2: '',
            nested_c: {
              test3: 'aaa',
            }
          },
        },
      },
    },
  });
  const [targetLanguages, setTargetLanguages] = React.useState<LanguageCode[]>([]);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = React.useState<LanguageCode>('ro');
  const [selectedNamespace, setSelectedNamespace] = React.useState<string>('common');
  return (
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
    }}>
      <div className="App">
        <HeaderBar />
        <TranslatePage />
      </div>
    </TranslationContext.Provider>
  );
}

export default App;
