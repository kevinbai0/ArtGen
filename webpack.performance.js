const path = require("path")

module.exports = {
    entry: "./tests/performance/index.ts",
    target: "node",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "performance.bundle.js"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.m?(ts|js)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.m?(ts|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
}
