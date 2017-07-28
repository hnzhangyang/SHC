/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var nodeOps = __webpack_require__(4)
var VNode = __webpack_require__(5)
var utils = __webpack_require__(3)

var hooks = ['create', 'update', 'remove', 'destroy']

function isUndef(s) {
    return s == null
}

function isDef(s) {
    return s != null
}

function sameVnode(vnode1, vnode2) {
    return (
        vnode1.key === vnode2.key &&
        vnode1.tag === vnode2.tag &&
        !vnode1.data === !vnode2.data
    )
}

function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key
    var map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (isDef(key)) map[key] = i
    }
    return map
}

function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; startIdx++) {
        nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx]), before)
    }
}


function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx]
        if (isDef(ch.tag)) {
            nodeOps.removeChild(parentElm, ch.elm)
        } else {
            // text node
            nodeOps.removeChild(parentElm, ch.elm)
        }
    }
}


function patchVnode(oldVnode, vnode) {
    if (oldVnode === vnode) return

    var i
    var data = vnode.data
    var hasData = isDef(data)
    var elm = vnode.elm = oldVnode.elm
    var oldCh = oldVnode.children
    var ch = vnode.children

    if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) updateChildren(elm, oldCh, ch)
        }
        else if (isDef(ch)) {
            if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
            addVnodes(elm, null, ch, 0, ch.length - 1)
        }
        else if (isDef(oldCh)) {
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        }
        else if (oldVnode.text !== vnode.text) {
            nodeOps.setTextContent(elm, '')
        }
    }

    else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text)
    }
}

function createChildren(vnode, children) {
    if (utils.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
            nodeOps.appendChild(vnode.elm, createElm(children[i]))
        }
    }

    else if (utils.isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text))
    }
}

function createElm(vnode) {
    var i
    var data = vnode.data
    var children = vnode.children
    var tag = vnode.tag

    if (isDef(tag)) {
        vnode.elm = nodeOps.createElement(tag, vnode)
        createChildren(vnode, children)
    }

    else if (vnode.isComment) {
        vnode.elm = nodeOps.createComment(vnode.text)
    }

    else {
        vnode.elm = nodeOps.createTextNode(vnode.text)
    }

    return vnode.elm
}

function updateChildren(parentElm, oldCh, newCh) {
    var oldStartIdx = 0
    var newStartIdx = 0
    var oldEndIdx = oldCh.length - 1
    var oldStartVnode = oldCh[0]
    var oldEndVnode = oldCh[oldEndIdx]
    var newEndIdx = newCh.length - 1
    var newStartVnode = newCh[0]
    var newEndVnode = newCh[newEndIdx]
    var oldKeyToIdx, idxInOld, elmToMove, before

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]
        }
        else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx]
        }
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }
        else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }
        else if (sameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }
        else if (sameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            patchVnode(oldEndVnode, newStartVode)
            nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }
        else {
            if (isUndef(oldKeyToIdx)) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }
            idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
            if (isUndef(idxInOld)) {
                // New element
                nodeOps.insertBefore(parentElm, createElm(newStartVnode), oldStartVnode.elm)
                newStartVnode = newCh[++newStartIdx]
            } else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.tag !== newStartVnode.tag) {
                    // same key but different element. treat as new element
                    nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                } else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = undefined
                    nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
    }

    if (oldStartIdx > oldEndIdx) {
        var before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

function patch(oldVnode, vnode) {
    if (!vnode) return

    var elm, parent

    if (!oldVnode) {
        // empty mount, create new root element
        createElm(vnode)
    } else {
        var isRealElement = isDef(oldVnode.nodeType)

        // update
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode)
        }

        // first patch
        else {
            if (isRealElement) oldVnode = emptyNodeAt(oldVnode)
            elm = oldVnode.elm
            parent = nodeOps.parentNode(elm)
            createElm(vnode)

            // component root element replaced.
            // update parent placeholder node element
            if (vnode.parent) vnode.parent.elm = vnode.elm

            if (parent !== null) {
                nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm))
                removeVnodes(parent, [oldVnode], 0, 0)
            }

        }
    }


    return vnode.elm
}


window.patch = patch

/***/ }),
/* 1 */
/***/ (function(module, exports) {


function warn(msg) {
    console.log(
        'SHC WARN ::' + msg
    )
}

module.exports = {
    warn: warn
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function trim(str) {
    if (str.trim) {
        return str.trim()
    }

    return str
        .replace(/^\s*/, '')
        .replace(/\s*$/, '')
}

module.exports = {
    trim: trim
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var warn = __webpack_require__(1).warn
var trim = __webpack_require__(2).trim

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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function createTextNode(text) {
    return document.createTextNode(text)
}

function createComment(text) {
    return document.createComment(text)
}

function insertBefore(parentNode, newNode, refrenceNode) {
    parentNode.insertBefore(newNode, refrenceNode)
}

function removeChild(node, child) {
    node.removeChild(child)
}

function appendChild(node, child) {
    node.appendChild(child)
}

function parentNode(node) {
    return node.parentNode
}

function nextSibling(node) {
    return node.nextSibling
}

function tagName(node) {
    return node.tagName
}

function setTextContent(node, text) {
    node.textContent = text
}

function childNodes(node) {
    return node.childNodes
}

function setAttribute(node, key, val) {
    node.setAttribute(key, val)
}

function createElement(tag) {
    return document.createElement(tag)
}

module.exports = {
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    childNodes: childNodes,
    setAttribute: setAttribute,
    createElement: createElement
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function VNode(tag, data, children, text, elm, context) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
}

module.exports = VNode

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);