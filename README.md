# a simple HTML compiler
SHC is a simple HTML-template compiler that helps you compile your HTML code to AST(Abstract Syntax Tree).

SHC consists of a html-compiler and virtual DOM library. the virtual DOM library is alternative. Only you must to do is transforming your AST into vnode then you can use path function
to render your vnode.

## parse
SHC provides a convenient way to parse your HTML-template. Just call parse function.

The parse function takes two arguments. The first is your HTML-template and the second is an Object contain parsing hooks.

### usage
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

*Note*: Your HTML-template must have only 1 root element for now. if you have any advice, [issue](https://github.com/hnzhangyang/SHC/issues) me.


