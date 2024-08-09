import { AbstractElement } from "./AbstractElement.js";

export class Button extends AbstractElement {
    constructor(options) {
        const button = document.createElement("button");
        return super(button, options);
    }
}