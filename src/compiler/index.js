var parseHTML = require('./html-parser.js')
var warn = require('../util/index.js').warn
var util = require('../util/index.js')

function parse(template, options) {
    var stack = []
    var currentParent
    var root

    parseHTML(template, {
        start: function (tagName, attrs, unary, start, end) {
            // call start hook
            util.isFunction(options.start) && options.start(tagName, attrs, unary)

            var element = {
                type: 1,
                tag: tagName,
                attrsList: attrs,
                parent: currentParent,
                children: []
            }

            if (!root) {
                root = element
            }

            if (currentParent) {
                currentParent.children.push(element)
            }

            if (!unary) {
                currentParent = element
                stack.push(element)
            }
        },
        end: function (tagName, start, end) {
            // call end hook
            util.isFunction(options.end) && options.end(tagName)

            var element = stack[stack.length - 1]
            var lastNode = element.children[element.children.length - 1]

            // note: 3 represent text node
            if (lastNode && lastNode.type === 3 && lastNode.text === '') {
                element.children.pop()
            }

            // pop stack
            stack.length -= 1
            currentParent = stack[stack.length - 1]
        },
        chars: function (text) {
            if (!text) return

            // call chars hook
            util.isFunction(options.chars) && options.chars(text)

            currentParent.children.push({
                type: 3,
                text
            })
        }
    })

    return root
}



module.exports = parse