// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { getLocalizedData } from "./i18n/utils";
const { shared } = getLocalizedData({ currentLocale: "de" });

export const WORKING_PLACES = {
  bonn: shared.bonn,
  hamburg: shared.hamburg,
  bialystok: shared.bialystok,
} as const;

export const WORKING_HOURS = {
  fullTime: "fullTime",
  partTime: "partTime",
} as const;

export const SITE_TITLE = "cms prototype";
export const SITE_DESCRIPTION = "prototyping";
