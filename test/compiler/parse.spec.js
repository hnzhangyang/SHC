import { expect } from 'chai'
import parse from '../../src/compiler/index'


describe('parser', function () {
    it('simple element', () => {
        var ast = parse('<h1>hello world</h1>', {})
        expect(ast.tag).to.be.equal('h1')
        expect(ast.children[0].text).to.be.equal('hello world')
    })

    it('interpolation in element', () => {
        var ast = parse('<h1>{{msg}}</h1>', {})
        expect(ast.tag).to.be.equal('h1')
        expect(ast.children[0].text).to.be.equal('{{msg}}')
    })

    it('child elements', () => {
        var ast = parse('<ul><li>hello world</li></ul>', {})
        expect(ast.tag).to.be.equal('ul')
        expect(ast.children[0].tag).to.be.equal('li')
        expect(ast.children[0].children[0].text).to.be.equal('hello world')
        expect(ast.children[0].parent).to.be.equal(ast)
    })

    it('multiple children elements', () => {
        var template =
            `<ul>
            <li><a>number 1</a></li>
            <li><a>number 2</a></li>
        </ul>`
        var ast = parse(template, {})
        expect(ast.tag).to.be.equal('ul')
        expect(ast.children.length).to.be.equal(2)
        expect(ast.children[0].tag).to.be.equal('li')
        expect(ast.children[1].tag).to.be.equal('li')
        expect(ast.children[0].children[0].tag).to.be.equal('a')
        expect(ast.children[1].children[0].tag).to.be.equal('a')
        expect(ast.children[0].children[0].children[0].text).to.be.equal('number 1')
        expect(ast.children[1].children[0].children[0].text).to.be.equal('number 2')
    })

    it('camelCase element', () => {
        var ast = parse('<MyComponent><p>hello world</p></MyComponent>', {})
        expect(ast.tag).to.be.equal('MyComponent')
        expect(ast.children[0].tag).to.be.equal('p')
        expect(ast.children[0].children[0].text).to.be.equal('hello world')
        expect(ast.children[0].parent).to.be.equal(ast)
    })

    it('complicated camelCase element', () => {
        var template =
            `<MyComponent>
            <MyChild>hello world</MyChild>
        </MyComponent>`
        var ast = parse(template, {})
        expect(ast.tag).to.be.equal('MyComponent')
        expect(ast.children[0].tag).to.be.equal('MyChild')
        expect(ast.children[0].children[0].text).to.be.equal('hello world')
    })

    it('directive in element', () => {
        var ast = parse('<p class="p-class" data-value="1">hello world</p>', {})
        expect(ast.tag).to.be.equal('p')
        expect(ast.attrsList[0].name).to.be.equal('class')
        expect(ast.attrsList[0].value).to.be.equal('p-class')
        expect(ast.attrsList[1].name).to.be.equal('data-value')
        expect(ast.attrsList[1].value).to.be.equal('1')
    })

    it('complicated element', () => {
        var template = 
        `<MyComponent>
            <ul class="ul-class" data-for="item in items">
                <li>{item}</li>
            </ul>
            <p class="p-class">hello world</p>
            <MyChild>I am a element</MyChild>
        </MyComponent>`
        var ast = parse(template,{})
        expect(ast.tag).to.be.equal('MyComponent')
        // UL
        expect(ast.children[0].tag).to.be.equal('ul')
        expect(ast.children[0].attrsList.length).to.be.equal(2)

        // UL's attributes
        expect(ast.children[0].attrsList[0].name).to.be.equal('class')
        expect(ast.children[0].attrsList[0].value).to.be.equal('ul-class')
        expect(ast.children[0].attrsList[1].name).to.be.equal('data-for')
        expect(ast.children[0].attrsList[1].value).to.be.equal('item in items')

        // UL's children
        expect(ast.children[0].children[0].tag).to.be.equal('li')
        expect(ast.children[0].children[0].children[0].text).to.be.equal('{item}')

        // P
        expect(ast.children[1].tag).to.be.equal('p')
        expect(ast.children[1].attrsList[0].name).to.be.equal('class')
        expect(ast.children[1].attrsList[0].value).to.be.equal('p-class')
        expect(ast.children[1].children[0].text).to.be.equal('hello world')

        // MyChild
        expect(ast.children[2].tag).to.be.equal('MyChild')
        expect(ast.children[2].children[0].text).to.be.equal('I am a element')
    })


})