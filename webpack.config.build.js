/* eslint-disable class-methods-use-this */
const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

class TrickLernaPlugin {
    apply(compiler) {
        const isDirectory = (source) => fs.lstatSync(source).isDirectory();
        const getDirectories = (source) =>
            fs
                .readdirSync(source)
                .map((name) => path.join(source, name))
                .filter(isDirectory);

        compiler.hooks.done.tap('TrickLernaPlugin', (stats /* stats is passed as an argument when done hook is tapped.  */) => {
            try {
                const CDK_OUT_DIR = path.join(__dirname, './packages/cdk-app/cdk.out');
                getDirectories(CDK_OUT_DIR).forEach((dir) => {
                    const PACKAGE_JSON_FILE_PATH = path.join(dir, 'package.json');

                    if (fs.existsSync(PACKAGE_JSON_FILE_PATH)) {
                        const packageJsonOriginalContents = require(PACKAGE_JSON_FILE_PATH);

                        if (!packageJsonOriginalContents.name.includes('compiled')) {
                            const packageJsonContents = JSON.stringify({
                                version: packageJsonOriginalContents.version,
                                name: `${packageJsonOriginalContents.name}-compiled`,
                            });

                            fs.writeFileSync(PACKAGE_JSON_FILE_PATH, packageJsonContents);
                        }
                    }
                });
            } catch (err) {
                // console.log(err)
            }
        });
    }
}

// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
module.exports = (dirname) => {
    const SOURCE_DIR = path.join(dirname, './src/');
    const TARGET_DIR = path.join(dirname, './dist/');

    const filename = 'index.js';
    const entry = path.join(SOURCE_DIR, 'index.ts');

    const plugins = [];
    plugins.push(new TrickLernaPlugin());

    return {
        mode: 'production',
        devtool: 'source-map',
        entry,
        target: 'node',
        resolve: {
            extensions: ['.mjs', '.ts', '.js'],
            plugins: [
                new TsconfigPathsPlugin({
                    /* options: see below */
                }),
            ],
        },
        output: {
            libraryTarget: 'commonjs2',
            path: TARGET_DIR,
            filename,
        },
        //   externals: [],
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.join(dirname, 'tsconfig.build.json'),
                            },
                        },
                    ],
                },
            ],
        },
        plugins,
        externals: [{ 'aws-sdk': 'commonjs aws-sdk' }],
        optimization: {
            minimize: false,
            //   Turned this off because it apollo server throws error, schema must contain uniquely named types but contains multiple types named "XXX"
        },
    };
};
