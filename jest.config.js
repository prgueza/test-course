const path = require('path')

module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  testRegex: '\\.spec\\.js$',
  testPathIgnorePatterns: [ 'functions' ],
  coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
  collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**', '!functions/**/*.js'],
  verbose: true,
  // setupFiles: ['<rootDir>/test/unit/setup']
}
