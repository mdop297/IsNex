const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/acme'),
  },
  devServer: {
    port: 4200,
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'swc',
      main: './src/main.tsx',
      index: '.src/index.html',
      styles: ['./src/styles.css'],
      generatePackageJson: true,
    }),
  ],
};
