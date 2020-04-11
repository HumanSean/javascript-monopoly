/*
 * @Author: Human Sean
 * @Email: humansean@qq.com
 * @Date: 2020-04-11 16:18:03
 * @LastEditTime: 2020-04-11 17:03:04
 * @Description: 
 */
const path = require('path')

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "index.js"
    },
}