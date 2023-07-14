import { LanguageCode } from "./types";

export async function translateText(text: string, source: LanguageCode, target: LanguageCode, apiKey: string) {
  const result = await fetch('https://translation.googleapis.com/language/translate/v2?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text',
    }),
  });
  const json = await result.json();
  if(json.error) throw new Error(json.error.message);
  return json['data']['translations'][0]['translatedText'] as string;
}