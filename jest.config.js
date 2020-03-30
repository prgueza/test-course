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
  testPathIgnorePatterns: [
    'functions', // Comentar en parte de Jest
    // 'Counter', // Comentar en parte de Jest Vue
    // 'Button', // Comentar en parte de Jest Vue
    'examples'
   ],
  coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!**/node_modules/**',
    '!functions/**/*.js', // Comentar en parte de Jest
    // '!components/**', // Comentar en parte de Jest
    '!examples/**'
  ],
  verbose: true,
}
