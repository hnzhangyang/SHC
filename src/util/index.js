var warn = require('./env.js').warn
var trim = require('./hack.js').trim

function isArray(target) {
    return {}.toString.call(target) === '[object Array]'
}

function isObject(target) {
    return {}.toString.call(target) === '[object object]'
}

function isFunction(target) {
    return {}.toString.call(target) === '[object Function]'
}

function isString(target) {
    return {}.toString.call(target) === '[object String]'
}

function isPrimitive(str) {
    return typeof str === 'String' || typeof str === 'Number'
}

function makeMap(str) {
    var map = {}
    var list = str.split(',')
    for (var i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return function (val) {
        return map[val]
    }
}
module.exports = {
    warn: warn,
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    isString: isString,
    trim: trim,
    isPrimitive: isPrimitive,
    makeMap: makeMap
}