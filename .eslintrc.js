const eslintrc = {
  extends: ['eslint-config-airbnb'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    jest: true,
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'react',
    'babel'
  ],
  rules: {
    'no-unused-expressions': 0,
    'no-trailing-spaces': 0,
    'no-useless-constructor': 0,
    
    'func-names': 0,
    'arrow-body-style': 0,
    'react/sort-comp': 0,
    'react/prop-types': 0,
    'react/jsx-first-prop-new-line': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.md'] }],
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'no-return-assign': 0,
    'max-len': 0,
    'consistent-return': 0,
    'no-redeclare': 0,
    'react/require-extension': 0,
    'react/jsx-indent': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-has-content': 0,
    'react/no-danger': 0,
    'comma-dangle': ['error', 'always-multiline'],
  }
};

module.exports = eslintrc;
