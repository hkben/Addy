// Do this as the first thing so that any code reading it knows the right env.
const browserIndex = process.argv.indexOf('--browser');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';
process.env.BROWSER =
  browserIndex !== -1 ? process.argv[browserIndex + 1] : 'chrome';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  backgroundConfig = require('../webpack.background.config'),
  env = require('./env'),
  path = require('path');

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack([config, backgroundConfig]);

var server = new WebpackDevServer(
  {
    hot: true,
    client: false,
    port: env.PORT,
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}`,
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, '../build'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  compiler
);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

(async () => {
  await server.start();
})();
