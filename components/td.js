function createDefaultCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

function createCheckboxCell(id) {
    const cell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = `row-${id}`;
    cell.appendChild(checkbox);
    return cell;
}

function createButton(text, url) {
    const button = document.createElement('button');
    button.className = 'openWindow';
    button.setAttribute('data-href', url);
    button.setAttribute('data-query-modal-type', 'update');
    button.textContent = text;
    return button;
}

export { createDefaultCell, createCheckboxCell, createButton }