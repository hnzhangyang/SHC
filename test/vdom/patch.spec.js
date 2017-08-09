import { expect } from 'chai'
import patch from '../../src/vdom/index'
import VNode from '../../src/vdom/vnode'

describe('parser', function () {
    it('create simple element', () => {
        var vnode = new VNode('div', {}, [{ text: 'hello world' }])
        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('DIV')
        expect(elm.innerHTML).to.be.equal('hello world')
    })

    it('create element with class', () => {
        var vnode = new VNode('P', { class: 'p-class' }, [{ text: 'hello world' }])
        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('P')
        expect(elm.className).to.be.equal('p-class')
        expect(elm.innerHTML).to.be.equal('hello world')
    })

    it('create element with style', () => {
        var vnode = new VNode('a', { style: 'width:100px;height:50px' }, [{ text: 'hello world' }])
        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('A')
        expect(elm.style.width).to.be.equal('100px')
        expect(elm.style.height).to.be.equal('50px')
        expect(elm.innerHTML).to.be.equal('hello world')
    })

    it('create element with attribute', () => {
        var vnode = new VNode('span', { 'data-value': 'span-value' }, [{ text: 'hello world' }])
        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('SPAN')
        expect(elm.getAttribute('data-value')).to.be.equal('span-value')
        expect(elm.innerHTML).to.be.equal('hello world')
    })

    it('create element with children', () => {
        var vnode = new VNode('ul', {}, [
            new VNode('li', {}, [{ text: 'li 1' }]),
            new VNode('li', {}, [{ text: 'li 2' }]),
            new VNode('li', {}, [{ text: 'li 3' }])
        ])

        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('UL')
        expect(elm.children.length).to.be.equal(3)

        // children
        expect(elm.children[0].tagName).to.be.equal('LI')
        expect(elm.children[1].tagName).to.be.equal('LI')
        expect(elm.children[2].tagName).to.be.equal('LI')
        expect(elm.children[0].innerHTML).to.be.equal('li 1')
        expect(elm.children[1].innerHTML).to.be.equal('li 2')
        expect(elm.children[2].innerHTML).to.be.equal('li 3')
    })

    it('create complicated element', () => {
        var vnode = new VNode('ul', { class: 'ul-class' }, [
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a1-class', style: 'width:10px' }, [{ text: 'a 1' }])]),
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a2-class', style: 'width:20px' }, [{ text: 'a 2' }])]),
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a3-class', style: 'width:30px' }, [{ text: 'a 3' }])]),
        ])

        var elm = patch(null, vnode)
        expect(elm.tagName).to.be.equal('UL')
        expect(elm.children.length).to.be.equal(3)
        expect(elm.className).to.be.equal('ul-class')

        // children
        expect(elm.children[0].tagName).to.be.equal('LI')
        expect(elm.children[1].tagName).to.be.equal('LI')
        expect(elm.children[2].tagName).to.be.equal('LI')
        expect(elm.children[0].className).to.be.equal('li-class')
        expect(elm.children[0].children[0].tagName).to.be.equal('A')
        expect(elm.children[1].children[0].tagName).to.be.equal('A')
        expect(elm.children[2].children[0].tagName).to.be.equal('A')
        expect(elm.children[0].children[0].className).to.be.equal('a1-class')
        expect(elm.children[1].children[0].className).to.be.equal('a2-class')
        expect(elm.children[2].children[0].className).to.be.equal('a3-class')
        expect(elm.children[0].children[0].innerHTML).to.be.equal('a 1')
        expect(elm.children[1].children[0].innerHTML).to.be.equal('a 2')
        expect(elm.children[2].children[0].innerHTML).to.be.equal('a 3')
        expect(elm.children[0].children[0].style.width).to.be.equal('10px')
        expect(elm.children[1].children[0].style.width).to.be.equal('20px')
        expect(elm.children[2].children[0].style.width).to.be.equal('30px')
    })

    it('patch with 2 vnodes', () => {
        var vnode1 = new VNode('div', {}, [{ text: 'vnode1' }])
        var vnode2 = new VNode('div', {}, [{ text: 'vnode2' }])

        // should create an real document element and patch it first 
        var div = document.createElement('div')
        patch(div, vnode1)
        var  elm = patch(vnode1, vnode2)
        expect(elm.tagName).to.be.equal('DIV')
        expect(elm.innerHTML).to.be.equal('vnode2')
    })

    it('patch with 2 complicated vnodes',() => {
        var vnode1 = new VNode('div', {}, [{ text: 'vnode1' }])
        var vnode2 = new VNode('ul', { class: 'ul-class' }, [
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a1-class', style: 'width:10px' }, [{ text: 'a 1' }])]),
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a2-class', style: 'width:20px' }, [{ text: 'a 2' }])]),
            new VNode('li', { class: 'li-class' }, [new VNode('a', { class: 'a3-class', style: 'width:30px' }, [{ text: 'a 3' }])]),
        ])

        // should create an real document element and patch it first 
        var div = document.createElement('div')
        patch(div, vnode1)
        var  elm = patch(vnode1, vnode2)
        expect(elm.tagName).to.be.equal('UL')
        expect(elm.children.length).to.be.equal(3)
        expect(elm.className).to.be.equal('ul-class')

        // children
        expect(elm.children[0].tagName).to.be.equal('LI')
        expect(elm.children[1].tagName).to.be.equal('LI')
        expect(elm.children[2].tagName).to.be.equal('LI')
        expect(elm.children[0].className).to.be.equal('li-class')
        expect(elm.children[0].children[0].tagName).to.be.equal('A')
        expect(elm.children[1].children[0].tagName).to.be.equal('A')
        expect(elm.children[2].children[0].tagName).to.be.equal('A')
        expect(elm.children[0].children[0].className).to.be.equal('a1-class')
        expect(elm.children[1].children[0].className).to.be.equal('a2-class')
        expect(elm.children[2].children[0].className).to.be.equal('a3-class')
        expect(elm.children[0].children[0].innerHTML).to.be.equal('a 1')
        expect(elm.children[1].children[0].innerHTML).to.be.equal('a 2')
        expect(elm.children[2].children[0].innerHTML).to.be.equal('a 3')
        expect(elm.children[0].children[0].style.width).to.be.equal('10px')
        expect(elm.children[1].children[0].style.width).to.be.equal('20px')
        expect(elm.children[2].children[0].style.width).to.be.equal('30px')
    })

})