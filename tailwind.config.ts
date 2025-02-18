import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark_green: "#00281F",
        primary: "#169962",
        light_green: "#EDFBF5",
        light_gray: "#BABABA",
        dark_gray: "#1E1E1E",
        red: "#D81F47",
      },
    },
  },
  plugins: [],
} satisfies Config;
