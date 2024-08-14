import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://cms-balloon.netlify.app",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "de",
        locales: {
          en: "en",
          de: "de",
        },
      },
    }),
    tailwind(),
  ],
  trailingSlash: "never",
  build: {
    format: "file",
  },
  i18n: {
    defaultLocale: "de",
    locales: ["de", "en"],
  },
});
