import { AbstractElement } from "./AbstractElement.js";

export class Span extends AbstractElement {
    constructor(options) {
        const span = document.createElement("span");
        super(span, options);
    }
}