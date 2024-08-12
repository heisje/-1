import { AbstractElement } from "./AbstractElement.js";

export class Button extends AbstractElement {
    constructor(options) {
        const button = document.createElement("button");

        super(button, options);
        this.button = button;
        return this;
    }

    addRemoveEventListener() {
        this.button.addEventListener('click', () => { this.button.remove() });
    }
}