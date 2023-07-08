module.exports = {
  'extends': ['next', 'next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  'rules': {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'object-curly-spacing': ['warn', 'never'],
    'array-bracket-spacing': ['warn', 'never'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-danger-with-children': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-is-mounted': 'warn',
    'react/no-typos': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/require-render-return': 'error',
    'react/style-prop-object': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  }
};
