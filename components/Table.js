import { Td } from "./Td.js";

export class TableManager {
    constructor({ columns = [] }) {
        this.table = document.getElementById("list-table2");
        this.tbody = document.getElementById("table-body2");
        this.columns = columns;
    }

    renderTable(data) {
        this.tbody.innerHTML = "";
        const tr = new Tr({ setAttribute: { qualifiedName: 'id', value: data.id }, parent: this.tbody });
        data.forEach((item) => {
            this.columns.forEach((column) => {
                const td = Td({ text: item?.[column], parent: tr.tr });
            });
        })
    }
}

class Tr {
    constructor({ children, text, attributes = [], parent = document.body }) {
        this.tr = document.createElement('tr');
        if (children) { this.tr.appendChild(children); };
        if (text) { this.tr.textContent = text };
        if (attributes) {
            attributes.forEach(({ qualifiedName, value }) => {
                this.tr.setAttribute(qualifiedName, value);
            })
        }
        parent.appendChild(this.tr);
    }
}
