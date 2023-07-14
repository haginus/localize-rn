import React from "react";
import { LanguageCode, TranslationFile } from "../lib/types";

export const TranslationContext = React.createContext<ITranslationContext>({} as ITranslationContext);

export interface ITranslationContext {
  sourceLanguage: LanguageCode;
  setSourceLanguage: (language: LanguageCode) => void;
  translationFile: TranslationFile;
  setTranslationFile: (translationFile: TranslationFile) => void;
  targetLanguages: LanguageCode[];
  setTargetLanguages: (languages: LanguageCode[]) => void;
  addTargetLanguage: (language: LanguageCode) => void;
  selectedTargetLanguage: LanguageCode;
  setSelectedTargetLanguage: (language: LanguageCode) => void;
  selectedNamespace: string;
  setSelectedNamespace: (namespace: string) => void;
  translateApiKey: string;
  setTranslateApiKey: (apiKey: string) => void;
}