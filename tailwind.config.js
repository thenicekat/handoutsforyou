/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{html,js,tsx}", "./Components/**/*.{html,js,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        styled: true,
        themes: [
            {
                mytheme: {
                    primary: "#911af2",

                    secondary: "#4c16a3",

                    accent: "#b1ed71",

                    neutral: "#1d282f",

                    "base-100": "#BFAFB2",

                    info: "#fff",

                    success: "#6ce09c",

                    warning: "#bb7b0c",

                    error: "#e25a6c",
                },
            },
        ],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: "",
        darkTheme: "dark",
    },
};
