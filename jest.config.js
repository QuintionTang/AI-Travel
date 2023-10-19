module.exports = {
    testEnvironment: "jsdom",
    collectCoverageFrom: [
        "components/**/*.{ts,tsx}",
        "utils/**/*.{ts,tsx}",
        "!<rootDir>/src/pages/**",
        "!coverage/**",
        "!.next/**",
        "!<rootDir>/next.config.js",
    ],
    testPathIgnorePatterns: [
        "<rootDir>/.next",
        "<rootDir>/node_modules/",
        "<rootDir>/next.config.js",
        "<rootDir>/coverage/",
        "<rootDir>/enzyme.js",
    ],
    coverageThreshold: {
        global: {
            statements: 30,
            functions: 30,
            lines: 30,
        },
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test))\\.(ts|tsx)$",
    snapshotSerializers: [],
    moduleDirectories: ["node_modules", "src", "server", "<rootDir>"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    moduleNameMapper: {
        flexboxgrid: "<rootDir>/src/components/FlexboxGrid",
    },
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
