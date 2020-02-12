import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration, RuleSetRule, Resolve, Plugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';

const rules: RuleSetRule[] = [
  {
    loader: [
      MiniCssExtractPlugin.loader, // instead of style-loader
      'css-loader'
    ],
    test: /\.css$/
  },
  {
    include: path.resolve(__dirname, 'src/app'),
    test: /\.styl$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: false,
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [autoprefixer()]
        }
      },
      {
        loader: 'stylus-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    exclude: /node_modules/,
    loader: 'ts-loader',
    // TODO - Attempt to have tsconfig ignore relevant app/server dirs.
    // Many be possible with tsconfig.server extends tsconfig -> exclude
    // options: {
    //   configFile: path.resolve(__dirname, 'tsconfig.server.json')
    // },
    test: /\.tsx?$/
  }
];

// TODO - Shouldn't be any need for MiniCss in app
// Try to make importing to ts only work
const plugins: Plugin[] = [
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    chunkFilename: '[id].[hash:8].css',
    filename: '[name].[hash:8].bundle.css',
  })
];

const resolve: Resolve = {
  alias: {
    '@store': path.resolve(__dirname, 'src/store')
  },
  extensions: ['.css', '.js', '.styl', '.ts', '.tsx']
};

//

const appConfig: Configuration = {
  devtool: 'inline-source-map',
  entry: {
    app: path.resolve(__dirname, 'src/app/index.tsx')
  },
  module: { rules },
  output: {
    chunkFilename: '[id].[hash:8].js',
    filename: '[name].[hash:8].bundle.js',
    // library: 'app',
    // libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/dist/',
    sourceMapFilename: '[name].[hash:8].map',
  },
  plugins,
  resolve
};

const serverConfig: Configuration = {
  entry: {
    server: [
      // component library styles - link in ssr string
      path.resolve(__dirname, 'node_modules/react-grid-layout/css/styles.css'),
      path.resolve(__dirname, 'node_modules/react-resizable/css/styles.css'),
      //
      path.resolve(__dirname, 'src/server/index.tsx')
    ]
  },
  externals: [nodeExternals()],
  module: { rules },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    chunkFilename: '[id].[hash:8].js',
    filename: '[name].[hash:8].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].[hash:8].map',
  },
  plugins,
  resolve,
  target: 'node'
};

export default [appConfig, serverConfig];
