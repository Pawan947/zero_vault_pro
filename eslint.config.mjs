import nodePlugin from "eslint-plugin-node";

export default [
    {
        files: ["**/*.js"],
        ignores: [
            "node_modules/**",
            "public/cryptoWorker.js",
            "public/webrtcShare.js"
        ],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                console: "readonly",
                process: "readonly",
                __dirname: "readonly",
                require: "readonly",
                module: "readonly",
                Buffer: "readonly",
                setTimeout: "readonly",
                fetch: "readonly"
            }
        },
        plugins: {
            node: nodePlugin
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["warn", "always"],
            "quotes": ["warn", "double", { "avoidEscape": true }]
        }
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module"
        }
    }
];
