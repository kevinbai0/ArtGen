const path = require("path")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname, "examples"),
        compress: true,
        port: 9000
    }
})
