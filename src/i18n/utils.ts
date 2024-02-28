import de from "./locales/de/germanNamespaces";
import en from "./locales/en/englishNamespaces";
import { getRelativeLocaleUrl } from "astro:i18n";
import { LANGUAGES, type Language } from ".";

export function getTranslatedLink({
  currentLocale,
  pathname,
}: {
  currentLocale?: string;
  pathname: string;
}) {
  return getRelativeLocaleUrl(
    currentLocale && currentLocale === LANGUAGES.DE
      ? LANGUAGES.EN
      : LANGUAGES.DE,
    pathname,
  );
}

export function getCurrentLocale(currentLocale?: string) {
  if (currentLocale !== LANGUAGES.DE && currentLocale !== LANGUAGES.EN) {
    throw new Error("currentLocale does not match defined languages");
  }

  return currentLocale as Language;
}

export function getLocalizedData({
  currentLocale = "de",
}: {
  currentLocale: Language | undefined;
}) {
  if (currentLocale === LANGUAGES.EN) {
    return en;
  }

  return de;
}
