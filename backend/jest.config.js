module.exports = {
    testEnvironment: 'node',

    testMatch: [
        '**/tests/**/*.test.js'
    ],

    clearMocks: true,

    collectCoverageFrom: [
        'controllers/**/*.js',
        'models/**/*.js',
        'middlewares/**/*.js',
        'services/**/*.js'
    ],

    coverageDirectory: 'coverage',

    coverageReporters: [
        'text',
        'html'
    ]
}
