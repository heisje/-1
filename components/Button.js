export class Button {
    constructor({ text = 'Button', classes = [], onClick = null, parent = document.body } = {}) {
        // Create the button element
        this.button = document.createElement('button');
        this.button.textContent = text;

        if (classes.length > 0) {
            this.button.classList.add(...classes);
        }


        if (onClick) {
            this.button.addEventListener('click', onClick);
        }

        parent.appendChild(this.button);
    }

    setAttribute(key, value) {
        this.button.setAttribute(key, value);
    }

    setText(text) {
        this.button.textContent = text;
    }

    addClass(...classes) {
        this.button.classList.add(...classes);
    }

    removeClass(...classes) {
        this.button.classList.remove(...classes);
    }

    addEventListener(event, handler) {
        this.button.addEventListener(event, handler);
    }

    removeEventListener(event, handler) {
        this.button.removeEventListener(event, handler);
    }
}