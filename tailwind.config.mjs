/** @type {import('tailwindcss').Config} */
import tailwindTypography from "@tailwindcss/typography";
import tailwindForms from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindTypography, tailwindForms],
};
