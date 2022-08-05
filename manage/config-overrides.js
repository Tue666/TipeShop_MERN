const path = require('path');
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
  adjustStyleLoaders,
} = require('customize-cra');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

const options = {
  stylesDir: path.join(__dirname, './src/theme'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/theme/vars.less'),
  themeVariables: ['@primary-color', '@body-background', '@component-background', '@text-color'],
  indexFileName: 'index.html',
  lessUrl: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
  generateOnce: false, // generate color.less on each compilation
};

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackPlugin(new AntDesignThemePlugin(options)),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
  }),
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options;
    postcss.options = { postcssOptions };
  })
);
