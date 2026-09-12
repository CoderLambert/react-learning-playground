/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,mdx}"],
  corePlugins: {
    // The playground already has a mature global reset/design system. New UI
    // uses Tailwind utilities without allowing preflight to change legacy UI.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
