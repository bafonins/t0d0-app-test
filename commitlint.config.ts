module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["chore", "ci", "docs", "feat", "fix", "test", "refactor"],
    ],
    "subject-case": [2, "always", ["sentence-case"]],
  },
};
