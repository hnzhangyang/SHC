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