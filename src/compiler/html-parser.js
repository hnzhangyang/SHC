var trim = require('../util/index.js').trim
var makeMap = require('../util/index.js').makeMap

var doctype = /^<!DOCTYPE [^>]+>/i
var endTag = /^<\/((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)[^>]*>/
var startTagOpen = /^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/
var startTagClose = /^\s*(\/?)>/
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*((?:=))\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

function parseHTML(html, options) {
    var stack = []
    var lastTag
    var last
    var index = 0
    while (html) {
        html = trim(html)
        var textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // comment
            if (/^<!--/.test(html)) {
                var commentEnd = html.indexOf('-->')
                advance(commentEnd + 3)
                continue
            }

            // doctype
            var doctypeMatch = html.match(doctype)
            if (doctypeMatch) {
                advance(doctypeMatch[0].length)
                continue
            }

            // end tag
            var endTagMatch = html.match(endTag)
            if (endTagMatch) {
                var curIndex = index
                advance(endTagMatch[0].length)
                parseEndTag(endTagMatch[0], endTagMatch[1], curIndex, index)
                continue
            }

            // start tag
            var startTagMatch = parseStartTag()
            if (startTagMatch) {
                handleStartTag(startTagMatch)
                continue
            }
        }

        // parse content with the current tag
        else if (textEnd > 0) {
            var text = html.substring(0, textEnd)
            advance(textEnd)
        }

        // that means the last content has not tag
        else {
            text = html
            html = ''
        }

        options.chars && options.chars(text)
    }

    function advance(n) {
        index += n
        html = html.substring(n)
    }


    function parseStartTag() {
        var start = html.match(startTagOpen)
        var end, attr

        if (start) {
            var match = {
                tagName: start[1],
                attrs: [],
                start: index
            }

            advance(start[0].length)

            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push(attr)
            }

            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    function handleStartTag(match) {
        var tagName = match.tagName
        var unarySlash = match.unarySlash

        var unary = tagName === 'html' || tagName === 'head' || !!unarySlash

        var attrs = []

        // filter attributes
        for (var i = 0; i < match.attrs.length; i++) {
            var args = match.attrs[i]
            var name = args[1]
            var value = args[3] || args[4] || args[5]
            attrs.push({
                name: name,
                value: value
            })
        }

        if (!unary) {
            stack.push({ tag: tagName, attrs: attrs })
            lastTag = tagName
            unarySlash = ''
        }

        // call start hook
        options.start && options.start(tagName, attrs, unary, match.start, match.end)
    }

    function parseEndTag(tag, tagName, start, end) {
        var start = start || index
        var end = end || index

        // find the closest opened tag of the same type
        if (tagName) {
            var needle = tagName.toLowerCase()
            for (var pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos].tag.toLowerCase() === needle) {
                    break
                }
            }
        } else {
            pos = 0
        }

        if (pos >= 0) {
            // close all the open elments, up the stack
            for (var i = stack.length - 1; i >= pos; i--) {
                options.end && options.end(stack[i].tag, start, end)
            }

            // remove the open elements form the stack , and reset the lastTag if the pos is valuable
            stack.length = pos
            lastTag = pos && stack[pos - 1].tag
        }
    }
}

module.exports = parseHTML