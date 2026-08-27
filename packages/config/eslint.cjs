const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const nodePlugin = require("eslint-plugin-node");
const promisePlugin = require("eslint-plugin-promise");
const securityPlugin = require("eslint-plugin-security");
const tsParser = require("@typescript-eslint/parser");
const prettier = require('eslint-plugin-prettier');

/** @type {import("eslint").FlatESLintConfig[]} */
module.exports = [
  { 
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      prettier,
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      node: nodePlugin,
      promise: promisePlugin,
      security: securityPlugin,
    },

    ignores: ["dist/*", "build/*", "node_modules/*"],
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" }
      ],
      "@typescript-eslint/no-use-before-define": "error",
      "no-trailing-spaces": "warn",
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "linebreak-style": ["error", "unix"],
      "no-irregular-whitespace": "warn",
      "@typescript-eslint/require-await" : "off",
      "comma-spacing": ["error", { "before": false, "after": true }],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "ignore",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];
