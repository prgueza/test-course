const path = require('path')

module.exports = {

  rootDir: 'src',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@test-utils/(.*)$': './utils/$1',
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.js$': path.resolve(__dirname, 'node_modules/babel-jest'),
    '.*\\.(vue)$': path.resolve(__dirname, 'node_modules/vue-jest'),
    '.+\\.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2)$': path.resolve(__dirname, 'node_modules/jest-transform-stub'),
  },
  testRegex: '\\.spec\\.js$',
  testPathIgnorePatterns: [ 'functions' ],
  snapshotSerializers: [ path.resolve(__dirname, 'node_modules/jest-serializer-vue') ],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: path.resolve(__dirname, 'reports/unit/coverage'),
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/events-bus.js',
    '!src/router/index.js',
    '!**/node_modules/**',
    '!src/lang/**',
    '!src/views/test.vue',
    '!src/store/store.js'
  ],
  verbose: true,
  testURL: 'http://localhost/',
  testResultsProcessor: 'jest-sonar-reporter'
}
