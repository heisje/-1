// this로 지정해두고 참조하는 것이 있으면 메모리 누수가 생성될 것이라 예상되어 .render시 객체 주입
export class AbstractElement {

    constructor(element, options) {
        this._createElement(element, options);
        return this;
    }

    _createElement(element, {
        text = '',
        classes = [],
        onClick = null,
        parent = document.body,
        attributes = []
    } = {}) {

        // 타입을 체크박스로 설정
        if (text) {
            element.textContent = text;
        }

        if (classes.length > 0) {
            element.classList.add(...classes);
        }

        if (attributes) {
            attributes.forEach(({ qualifiedName, value }) => {
                element.setAttribute(qualifiedName, value);
            })
        }

        if (onClick) {
            element.addEventListener('click', onClick);
        }

        parent.appendChild(element);
        return this;
    }
}