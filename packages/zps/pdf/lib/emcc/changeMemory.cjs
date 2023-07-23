const fs = require('fs')
const path = './src/upstream/emscripten/src/settings.js'
let content = fs.readFileSync(path, "utf-8")
content = content.replace(/var INITIAL_MEMORY = 16777216;/, "var INITIAL_MEMORY = 65536000;")
fs.writeFileSync(path, content)