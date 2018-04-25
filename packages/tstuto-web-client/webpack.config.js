const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const REPO_ROOT = __dirname;

module.exports = {
    entry: {
        'main': [
            './src/main-client.ts'
        ]
    },

    externals: {
        // Add here any module you do not want to bundle with your application.
        // In general, those will be libraries such as React, angular, etc... You'll want
        // to load those separately to optimize caching and compilation time.

        // 'react': 'React'
    },

    output: {
        filename: '[name].js',
        path: path.resolve(REPO_ROOT, 'public/dist'),
        publicPath: '/dist'
    },

    devServer: {
        compress: true,
        port: 9000,
        hot: true,
        contentBase: 'public',
        allowedHosts: ['localhost']
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.less'],

        // Important: We tell webpack to look for node modules in the parent folder as well.
        modules: ['node_modules', 'src', '..']
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [{
            include: path.join(REPO_ROOT, '.'),
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader'
                },
            ]
        }]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin({
            // Compute HMR chunks first
            multiStep: true
        }),
        new webpack.NamedModulesPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
};