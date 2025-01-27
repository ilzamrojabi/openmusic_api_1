import globals from "globals";
import pluginJs from "@eslint/js";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//    {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//    {languageOptions: { globals: globals.node }},
//    pluginJs.configs.recommended,
// ];


// {
//     "env": {
//         "es2021": true,
//         "node": true
//     },
//     "extends": [
//         "airbnb-base"
//     ],
//     "parserOptions": {
//         "ecmaVersion": 2020
//     },
//     "rules": {
//         "no-console": "off"
//     }
// }


module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
  },
};
