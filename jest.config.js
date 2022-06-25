module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePathIgnorePatterns: ["utils"],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
};
