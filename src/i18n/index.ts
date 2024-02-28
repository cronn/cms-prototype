import de from "./locales/de/germanNamespaces";
import en from "./locales/en/englishNamespaces";

export const LANGUAGES = {
  DE: "de",
  EN: "en",
} as const;

type Languages = typeof LANGUAGES;
export type Language = Languages[keyof Languages];

interface I18nDictionary {
  [key: string]: string | I18nDictionary;
}

export const locales: Record<Language, Record<string, I18nDictionary>> = {
  de: de,
  en: en,
};

const checkIfNamespaceIsDefined = (
  languages: Language[],
  namespaceKey: string,
) => {
  for (const lang of languages) {
    if (!Object.hasOwn(locales[lang], namespaceKey)) {
      return false;
    }
  }
  return true;
};

const checkIfAllNamespacesAreDefined = () => {
  const languages = Object.keys(locales) as Language[];

  languages.forEach((language) => {
    const allNamespacesInLanguage = Object.keys(locales[language] ?? []);

    allNamespacesInLanguage.forEach((namespace) => {
      if (!checkIfNamespaceIsDefined(languages, namespace)) {
        throw Error("You did not define all namespaces for every language");
      }
    });
  });
};

checkIfAllNamespacesAreDefined();
