import { expect } from 'chai'
import parse from '../../src/compiler/index'


describe('parser', function () {
    it('simple start hook', () => {
        var start = function (tagName, attrs, unary) {
            expect(tagName).to.be.equal('h1')
            expect(attrs[0].name).to.be.equal('class')
            expect(attrs[0].value).to.be.equal('hi-class')
            expect(unary).to.be.equal(false)
        }
        var ast = parse('<h1 class="hi-class">hello world</h1>', { start })
    })

    it('simple end hook', () => {
        var end = function (tagName) {
            expect(tagName).to.be.equal('h1')
        }
        var ast = parse('<h1>hello world</h1>', { end })
    })

    it('simple chars hook', () => {
        var chars = function (text) {
            expect(text).to.be.equal('hello world')
        }
        var ast = parse('<h1>hello world</h1>', { chars })
    })

    it('multiple start hook', () => {
        var arr = []
        var start = function (tagName, attrs, unary) {
            arr.push(tagName)
        }
        var ast = parse('<p><a>hello world</a></p>', { start })
        expect(arr.length).to.be.equal(2)
    })

    it('multiple end hook', () => {
        var arr = []
        var end = function (tagName) {
            arr.push(tagName)
        }

        var ast = parse('<p><a>hello world</a></p>', { end })

        expect(arr.length).to.be.equal(2)
    })
})