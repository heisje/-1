import { AbstractElement } from "./AbstractElement.js";

export class CheckBox extends AbstractElement {
    constructor(options) {
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        return super(checkbox, options);
    }

    _createElement(element, {
        text = '',
        classes = [],
        onClick = null,
        parent = document.body,
        attributes = [],
        index = 0,
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

        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add("checkbox-container");
        const label = document.createElement('label');
        element.id = `checkbox${index}`;
        label.setAttribute('for', `checkbox${index}`);

        checkboxContainer.appendChild(element);
        element.addEventListener('change', (event) => {
            if (event.target.checked) {
                element.classList.add("checked");
                checkboxContainer.classList.add("checked");
            } else {
                element.classList.remove("checked");
                checkboxContainer.classList.remove("checked");
            }
        });

        checkboxContainer.appendChild(element);
        checkboxContainer.appendChild(label);
        label.textContent = index;
        checkboxContainer.style.position = 'relative';
        parent.appendChild(checkboxContainer);
        return this;
    }
}
