const path = require("path")

module.exports = {
    entry: "./src/index",
    target: "web",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "artgen.bundle.js",
        library: "ArtGen",
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
    }
}
