var utils = require('../util/index.js')

function createElement(tag, data, children) {
    if (data && util.isArray(data) || typeof data !== 'object') {
        children = data
        data = undefined
    }

    return _createElement(this._self, tag, data, children)
}

function _createElement(context, tag, data, children) {
    if(data && data.__ob__) return
    
}