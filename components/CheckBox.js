import { AbstractElement } from "./AbstractElement.js";

export class CCheckBox extends AbstractElement {
    constructor(options) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        return super(checkbox, options);
    }
}