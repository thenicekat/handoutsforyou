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
                    primary: "#3008a0",

                    secondary: "#e5786b",

                    accent: "#60ed44",

                    neutral: "#2a2933",

                    "base-100": "#fcfcfd",

                    info: "#2c8ae2",

                    success: "#2de1b1",

                    warning: "#f89f2a",

                    error: "#e95d7e",
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
