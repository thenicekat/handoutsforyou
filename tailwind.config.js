/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{html,js,tsx}", "./Components/**/*.{html,js,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    fontFamily:
                        "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
                    primary: "#ffffff",
                    secondary: "#1a1a1a",
                    accent: "#2dd4bf",
                    neutral: "#FFFFFF",
                    "base-100": "#1a1a1a",
                    info: "#D1D1D1",
                    success: "#8FBCBB",
                    warning: "#ffdc00",
                    error: "#BF616A",
                },
            },
        ],
    },
};
