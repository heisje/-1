import { AbstractElement } from "./AbstractElement.js";

export class CCheckBox extends AbstractElement {
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
        const background = document.createElement('div');
        const label = document.createElement('label');
        element.id = `checkbox${index}`;
        label.setAttribute('for', `checkbox${index}`);


        checkboxContainer.appendChild(element);
        element.addEventListener('change', (event) => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            console.log(checkboxes);
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
        checkboxContainer.appendChild(background);
        label.textContent = index;
        checkboxContainer.style.position = 'relative';
        // background.style.position = 'absolute';
        // background.style.width = '1rem'
        // background.style.height = '1rem'
        // background.style.left = '0';
        // background.style.top = '0';
        // background.textContent = index;
        parent.appendChild(checkboxContainer);
        return this;
    }
}
