export class TableManager {
    constructor({ columns = [] }) {
        this.table = document.getElementById("list-table2");
        this.tbody = document.getElementById("table-body2");
        this.columns = columns;
    }

    renderTable(data) {
        this.tbody.innerHTML = "";
        console.log(data);
        const tr = new Tr({ setAttribute: { qualifiedName: 'id', value: data.id }, parent: this.tbody });
        data.forEach((item) => {
            this.columns.forEach((column) => {
                console.log(tr.tr, item?.[column]);
                const td = new Td({ text: item?.[column], parent: tr.tr });
                console.log(td.td);
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

        console.log(parent)
        parent.appendChild(this.tr);
    }
}
