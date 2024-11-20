/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/**/**/**/*.{js,jsx,ts,tsx}", "./node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}",],
  safelist: [
    "self-end", "bg-blue-600", "text-white",
    "self-start", "bg-gray-50", "text-black",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
      poppins: ['"Poppins"', 'sans-serif'],
    },
  },
  plugins: [],
};
