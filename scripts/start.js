'use strict';

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const devServerConfig = require('../config/server.config')
const paths = require('../config/config-utils/path')
const webpackDevConfig = require('../config/webpack.config.dev');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const openBrowser = require('react-dev-utils/openBrowser');
// const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const chalk = require('chalk');
const {
  choosePort,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

choosePort(HOST, DEFAULT_PORT).then(port => {
  const urls = prepareUrls(
    protocol,
    HOST,
    port,
    paths.publicUrlOrPath.slice(0, -1)
  );

  const options = {
    https: process.env.HTTPS,
    historyApiFallback: true,
    contentBase: paths.appPublic,
    compress: true,
    watchContentBase: true,
    hot: true,
    publicPath: '/',
    inline: true,
    stats: {
      colors: true,
      cached: true,
      builtAt: true,
      timings: true,
    },
    host: HOST,
    port: port,
    open: false,
    transportMode: 'ws',
    overlay: false,
    // writeToDisk: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    public: urls.lanUrlForTerminal,
    disableHostCheck: true,
  };

  const _options = merge(options, devServerConfig);

  WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, _options);

  const compiler = webpack(webpackDevConfig);

  // function clearConsole () {
  //   process.stdout.write(
  //     process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  //   );
  // }

  function printInstructions (appName, urls, useYarn) {
    // clearConsole()
    console.log('------------------------------------------------------------');
    console.log(`???????????????????????????????????? ${chalk.blueBright(appName)} ??????.`);
    console.log('------------------------------------------------------------');

    if (urls.lanUrlForTerminal) {
      console.log('------------------------------------------------------------');
      console.log(
        `  ${chalk.bold('??????:')}            ${urls.localUrlForTerminal}`
      );
      console.log(
        `  ${chalk.bold('??????:')}  ${urls.lanUrlForTerminal}`
      );
      console.log('------------------------------------------------------------');
    } else {
      console.log('------------------------------------------------------------');
      console.log(chalk.bold(`  ${urls.localUrlForTerminal}`));
      console.log('------------------------------------------------------------');
    }
  }

  compiler.hooks.done.tap('done', stats => {
    printInstructions('REACT-CLI', urls)
  })

  const server = new WebpackDevServer(compiler, _options);

  server.listen(port, HOST, function (err) {
    if (err) {
      return console.log(err);
    }
    openBrowser(urls.localUrlForBrowser);
  })
});
