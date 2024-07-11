/** @type {import("prettier").Config} */
export default {
  trailingComma: "es5",
  printWidth: 100,
  tabWidth: 4,
  semi: false,
  singleQuote: true,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
