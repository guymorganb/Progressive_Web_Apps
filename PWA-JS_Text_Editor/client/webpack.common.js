/**
 * Contains the configuration settings that are common to both development and production environments.
 * Base configuration for webpack (this will be injected into webpack.dev.js 
 * during developmnet and later this will be injected into webpack.prod.js in production creating a separation of concerns)
 */
// Import required plugins and libraries
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
module.exports = {
    // Entry points for the application. Here we have two: 'main' and 'install'
    entry: {
        main: './src/js/index.js',
        install: './src/js/install.js' // conains installation behaviors
    },
    // Define how the output files should be named and where they should be located
    output: { // [name] --> main.bundle.js 
        filename: '[name].bundle.js', // Use the entry names as file names. E.g., 'main.js' and 'install.js'
        path: path.resolve(__dirname, 'dist'), // Place the output files in a 'dist' directory
    },
    // Define loaders and options for processing different types of files
    module: {
        rules: [
            {
                // Use babel-loader for JavaScript files
                test: /\.m?js$/, // Match all .js files or .mjs files
                exclude: /(node_modules|bower_components)/, // Do not transpile files in node_modules
                loader: 'babel-loader', // Use babel-loader for transpilation
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: ['@babel/plugin-syntax-dynamic-import', "@babel/plugin-transform-runtime", "@babel/plugin-proposal-object-rest-spread"], // Enable dynamic imports in Babel
                }
            },
            {
                // Process CSS files
                test: /\.css$/, // Match all .css files
                use: [
                    MiniCssExtractPlugin.loader, // Extracts CSS into separate files
                    'css-loader' // Resolves CSS imports and loads them
                ]
            }
        ],
    },
    // Array of plugins to be applied to the build
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Template file to use as base
            title: 'Webpack Plugin', // Set the title for the generated HTML file
        }),
        new WebpackPwaManifest({ // creates the manifest.json and adds it to the browser
            fingerprints: false,
            inject: true, // injects into the browser
            name: 'Zero.to.fullstack',
            short_name: 'Zero.to.fullstack',
            description: 'Just another text editor',
            background_color: '#272822',
            theme_color: '#31a9e1',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            start_url: "/",
            publicPath: "/",
            icons: [
              {// get the logo.png, applie the sizes and saves it in the destination
                src: path.resolve('src/images/logo.png'), //
                sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                destination: path.join('assets','icons') // location inside the /dist
            },
            ]
        }),
              // Inject a precache manifest into a custom service worker
        new InjectManifest({
            swSrc: './src-sw.js', // Source file for the custom service worker
            swDest: 'src-sw.js',  // Destination for the new service worker with the manifest
        }),
        new MiniCssExtractPlugin({ // Initialize the plugin for extracting CSS
            filename: '[name].css',
            chunkFilename: '[id].css',
          }), 
    ],
};
