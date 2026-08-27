const rootConfig = require("@packages/config/eslint.cjs");

module.exports = [
  {
    ...rootConfig[0],
    languageOptions: {
      ...rootConfig[0].languageOptions,
      parserOptions: {
        ...rootConfig[0].languageOptions.parserOptions,
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    files: ["src/**/*.ts", "src/**/*.tsx"],
  },
  {
    ignores : rootConfig[0].ignores,
  } 
];
