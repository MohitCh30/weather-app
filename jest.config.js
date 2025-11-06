module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testMatch: [
    '**/+(*.)+(spec).+(ts|js)', // Looks for .spec.ts files
  ],
  moduleFileExtensions: ['ts', 'html', 'js'],
  collectCoverage: true,
  coverageReporters: ['html', 'lcov'],
};
