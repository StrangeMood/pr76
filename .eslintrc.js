module.exports = {
  env: {
    browser: true,
    'jest/globals': true
  },
  extends: [
    'airbnb'
  ],

  globals: {
    module: false,
    google: false,
    firebase: false,
    mapboxgl: false,
    turf: false,
  },

  rules: {
    'no-nested-ternary': 0,
    'quote-props': ['error', 'consistent'],
    'prefer-template': 0,
    'no-multi-assign': 0,
    'no-confusing-arrow': 0,
    'import/prefer-default-export': 0,
    'prefer-arrow-callback': ['error', { 'allowNamedFunctions': true }],
    'class-methods-use-this': 0,
    'semi': ['error', 'never'],
    'func-names': ['off'],
    'no-mixed-operators': ['off'],
    'no-param-reassign': ["error", { "props": false }],
    'consistent-return': ['off'],
    'comma-dangle': ['error', {
      functions: 'never',
      imports: 'never',
      exports: 'never',
      arrays: 'always-multiline',
      objects: 'always-multiline',
    }],
    'prefer-destructuring': ['off'],
    'max-len': ['error', 120],
    'no-constant-condition': ['error', { 'checkLoops': false }],
    'react/no-did-mount-set-state': ['off'],
    'react/jsx-no-bind': ['off'],
    'react/jsx-first-prop-new-line': ['off'],
    'react/jsx-max-props-per-line': ['off'],
    'react/jsx-closing-bracket-location': ['off'],
    'react/no-unused-prop-types': ['off'],
    'react/prefer-stateless-function': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/forbid-prop-types': ['off'],
    'react/require-default-props': ['off'],
    'react/no-array-index-key': ['off'],
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': ['off'],
  },

  plugins: [
    'jest'
  ],

  parser: 'babel-eslint'
}
