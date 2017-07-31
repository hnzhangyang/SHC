var parse = require('./compiler/index')
var patch = require('./vdom/patch')

window.parse = parse
window.patch = patch