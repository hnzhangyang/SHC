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

    it('camelCase element', () => {
        var ast = parse('<MyComponent><p>hello world</p></MyComponent>',{})
        expect(ast.tag).to.be.equal('MyComponent')
        expect(ast.children[0].tag).to.be.equal('p')
        expect(ast.children[0].children[0].text).to.be.equal('hello world')
        expect(ast.children[0].parent).to.be.equal(ast)
    })

    it('directive in element', ()=>{
        var ast = parse('<p class="p-class" data-value="1">hello world</p>',{})
        expect(ast.tag).to.be.equal('p')
        expect(ast.attrsList[0].name).to.be.equal('class')
        expect(ast.attrsList[0].value).to.be.equal('p-class')
        expect(ast.attrsList[1].name).to.be.equal('data-value')
        expect(ast.attrsList[1].value).to.be.equal('1')
    })
})