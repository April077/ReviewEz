/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],

  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },

  rules: {
    // Disable the no-explicit-any rule
    "@typescript-eslint/no-explicit-any": "off",
  },
};
