const path = require("path")

module.exports = {
    entry: {
        main: "./src/index",
        animated: "./src/animated/index",
        examples: "./src/art/index"
    },
    target: "web",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "ArtGen.[name].js",
        library: ["ArtGen", "[name]"],
        libraryTarget: "umd",
        globalObject: "this"
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
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
}
