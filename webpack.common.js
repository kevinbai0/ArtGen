const path = require("path");

module.exports = {
    entry: "./src/index",
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js',
        library: "ArtGen"
    },
    module: {
        rules: [
            {
                test: /\.m?(ts|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}