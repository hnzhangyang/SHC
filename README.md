# A simple HTML compiler
SHC is a simple HTML-template compiler that helps you compile your HTML code to AST(Abstract Syntax Tree).

SHC consists of a html-compiler and virtual DOM library. the virtual DOM library is alternative. Only you must to do is transforming your AST into vnode then you can use path function
to render your vnode.

## Parse
SHC provides a convenient way to parse your HTML-template. Just call parse function.

The parse function takes two arguments. The first is your HTML-template and the second is an Object contain parsing hooks.

### Usage
html 
``` html
<div id="target">
    <ul>
        <li>li 1</li>
        <li>li 2</li>
        <li>li 3</li>
        <li>li 4</li>
    </ul>
</div>
```

javaScript
``` javaScript
var template = document.getElementById('target').outerHTML
var root = parse(template)
```

The parse function return a AST object. 

**Note**: Your HTML-template must have only 1 root element for now. if you have any advice, [issue](https://github.com/hnzhangyang/SHC/issues) me : )

### Parsing hooks
The parse function to accept 3 hooks when parsing template. 
 - start
 - end 
 - chars

The start hooks call when SHC finds a new tag, the end hooks call when SHC tries to close a tag, the chars hook call when SHC parsing a node content.

``` javaScript
var template = document.getElementById('target').outerHTML
var root = parse(template, {
    start: function(tagName, attrs, unary) {
        console.log('start::' + tagName)
    },
    end: function(tagName) {
        console.log('end::' + tagName)
    },
    chars: function(text) {
        console.log('chars::' + text)
    }
})
```

## Patch
The patch function helps you render your vnode. Before use patch function you must transform your AST Object ( returned the parse function ) into vnode by youself.

### Vnode
Vnode must like below

``` javaScript
var vnode = {
    tag: tag,
    data: data,
    children: children,
    text: text,
    elm: elm,
    context: context
}
```
Also your can via VNode constructor to generate a vnode.

``` javaScript
var vnode = new VNode(tag, data, children, text, elm, context)
```
**Note** Normaly, for render a vnode, vnode object must have tag, data, children or text property. 

### Render
After you made your vnode. you can use the patch function to render vnode.

In the first render,there has only 1 vnode to patch, you can use it below.

``` html
<div id="example">
    <ul>
        <li>li 1</li>
        <li>li 2</li>
        <li>li 3</li>
        <li>li 4</li>
    </ul>
</div>
```

``` javaScript
var elm = document.getElementById('example')

patch(elm, vnode)
```

SHC will render the vnode on target 'example'.

And in the normaly case, you have 2 vnodes to compare which property needs update, just use it below.

``` javaScript
patch(vnode1, vnode2)
```
Vnode1 is the old vnode and vnode2 is the new vnode. SHC will compare the 2 vnode and update automatic.


## Note
- Do not use patch function to render AST object directly, this is illegal. 
- SHC is supporting IE6+ and modern browser. So you don't need to worried about compatibility issue.