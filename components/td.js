import { AbstractElement } from "./AbstractElement.js";

export class Td extends AbstractElement {
    constructor(options) {
        const td = document.createElement('td');
        return super(td, options);
    }
}

function Cell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function OpenButton(text, url) {
    const button = document.createElement('button');
    button.className = 'openWindow';
    button.setAttribute('data-href', url);
    button.setAttribute('data-query-modal-type', 'update');
    button.textContent = text;
    return button;
}

export { Cell, OpenButton }