import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default (env, argv) => {
  const isProduction = argv.mode === 'production';
  const plugins = [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new webpack.ProvidePlugin({
      // Provide the modules that you frequently use
      React: 'react-jsx-runtime',
      // Add more modules here as needed
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ];

  if (!isProduction) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[id].[contenthash].js',
      pathinfo: true,
    },
    plugins,
    stats: 'minimal',
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxInitialRequests: Infinity,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // Return the package name
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'swc-loader',
            options: {
              // Set the SWC options as needed
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
              cacheDirectory: true, // Add cache options to speed up build time
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            // any other loaders for postcss, sass, etc.
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
