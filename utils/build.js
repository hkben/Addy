// Do this as the first thing so that any code reading it knows the right env.
const browserIndex = process.argv.indexOf('--browser');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';
process.env.BROWSER =
  browserIndex !== -1 ? process.argv[browserIndex + 1] : 'chrome';

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

webpack(config, function (err) {
  if (err) throw err;
});
