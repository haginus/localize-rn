export type Translations = {
  [key: string]: string | Translations;
}

export type LanguageCode = string;

export type Namespace = string;

export type TranslationFile = {
  [language: LanguageCode]: {
    [namespace: Namespace]: Translations;
  }
}