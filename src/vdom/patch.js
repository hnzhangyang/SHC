var nodeOps = require('./env.js')
var VNode = require('./vnode.js')
var utils = require('../util/index.js')

var hooks = ['create', 'update', 'remove', 'destroy']

function isUndef(s) {
    return s == null
}

function isDef(s) {
    return s != null
}

// compare the two Vnodes.
function sameVnode(vnode1, vnode2) {
    return (
        vnode1.key === vnode2.key &&
        vnode1.tag === vnode2.tag &&
        !vnode1.data === !vnode2.data
    )
}

// generate an empty Vnode according to elm
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

        if (data) {
            for (var item in data) {
                if (data.hasOwnProperty(item)) {
                    nodeOps.setAttribute(vnode.elm, item, data[item])
                }
            }
        }

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


module.exports = patch