export function Td({ children, text, attributes = [], parent = document.body }) {
    const td = document.createElement('td');

    if (children) { td.appendChild(children); };
    if (text) { td.textContent = text };
    if (attributes) {
        attributes.forEach(({ qualifiedName, value }) => {
            td.setAttribute(qualifiedName, value);
        })
    }

    parent.appendChild(td);
    return td;
}


function Cell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function CheckBox(id) {
    const cell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = `row-${id}`;
    cell.appendChild(checkbox);
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

export { Cell, CheckBox, OpenButton }