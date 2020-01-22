const path = require('path')

console.log(path.resolve(__dirname))

module.exports = {
  rootDir: 'src',
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': path.resolve(__dirname, 'node_modules/babel-jest'),
  },
  testRegex: '\\.spec\\.js$',
  testPathIgnorePatterns: [ 'functions' ],
  coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
  collectCoverageFrom: ['**/*.js', '!**/node_modules/*x*', '!functions/**/*.js'],
  verbose: true,
}
