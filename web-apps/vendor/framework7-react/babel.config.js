import { BROWSERSLIST } from '../../build/browser-floor.mjs';

const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false,
        targets: BROWSERSLIST,
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', {'legacy': true }],
    ['@babel/plugin-transform-class-properties', { 'loose': false }],
    // '@babel/plugin-transform-optional-chaining',
    // '@babel/plugin-transform-nullish-coalescing-operator',
    // '@babel/plugin-transform-react-constant-elements',
  ]
};

export default config;
