var parse = require('./compiler/index')
var patch = require('./vdom/index')
var VNode = require('./vdom/vnode')

window.parse = parse
window.patch = patch
window.VNode = VNode