# CMS prototype

## ⚙️ Setup

- Node, consider [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) for easy node version
  management
- [pnpm](https://pnpm.io/installation)
- Docker

## 🛠️ Stack

- [Astro](https://astro.build/) (frontend)
  - Tailwind CSS
  - TypeScript
  - Eslint
  - Prettier
- [DecapCMS](https://decapcms.org/) (CMS)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── i18n/
│   ├── images/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   └── constants.ts
├── .prettierrc.mjs
├── astro.config.mjs
├── eslint.config.mjs
├── package.json
├── README.md
├── tailwind.config.mjs
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name. To avoid duplication, each page is built with a component that handles translated data and all the rest. Page components are located in `src/component/pages`.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Translations for both German and English are placed in the `src/i18n/locales` folder as JSON files. If you add new JSON files, you need to include them in both `germanNamespaces.ts` and `englishNamespaces.ts`. Helper functions can be found in `src/i18n/utils` and namespace validation in `src/i18n/index`. Translation logic is more or less a custom solution and therefore a work in progress. It only supports static side rendering at the moment.

Any static assets, like images, can be placed in the `public/` directory. Moreover, everything related to Decap CMS configuration resides in `public/admin`. Bootsrapping Decap CMS is done via `public/admin/index.html`, which additionally contains custom widget components (like the quote component) for the Decap markdown editor. The main Decap configuration can be adjusted in `public/admin/config.yml` where every type of content collection needs to be defined and the Git provider connection is set up. To start a local Decap server, set **local_backend: true**, run **npx decap-server** and go to `localhost:4321/admin/index.html`. All markdown or json entries created via Decap will be placed in their respective subfolders in `src/content/`. Images uploaded to Decap CMS are stored in `src/images`.

> ⚠️ To sync Decap CMS content collections (`public/admin/config.yml`) with Astro's content collections (`src/content/config.ts`), both configs and their type definitions need to match ⚠️

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |
| `pnpm run format`          | Run and apply prettier code formatting           |
| `pnpm run lint`            | Run eslint to analyze `.astro` and `.ts` files   |
| `npx decap-server`         | Starts local decap server at `localhost/8081` - access Decap CMS at `localhost:4321/admin/index.html`  |

## 👀 Want to learn more about Astro and Decap?

Check out the [Astro documentation](https://docs.astro.build) and [Decap documentation](https://decapcms.org/docs/intro/).
