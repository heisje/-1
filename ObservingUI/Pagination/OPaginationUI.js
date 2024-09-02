import { Button } from "../../components/common/Button.js";

export class OPaginationUI {
    update(object) {
        console.log("OPaginationUI update", object)
        this.render({ parent: document.getElementById('pagination-container'), data: object });
    }

    render({ parent, data }) {
        const { CurrentPage, TotalPage, onClickEvent } = data;
        console.log("OPaginationUI render", CurrentPage, TotalPage);
        if (!parent) {
            return;
        }

        parent.innerHTML = ''; // Clear existing pagination

        let startPage = Math.max(1, CurrentPage - 2);
        let endPage = Math.min(TotalPage, CurrentPage + 2);

        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(TotalPage, startPage + 4);
            } else if (endPage === TotalPage) {
                startPage = Math.max(1, endPage - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            new Button({
                classes: CurrentPage === i ? ['active'] : [],
                text: i,
                parent: parent,
                onClick: onClickEvent
            });
        }
    }
}