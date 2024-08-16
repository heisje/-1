import { Button } from "../../components/common/Button.js";

export class OPaginationUI {
    update(object) {
        this.render({ parent: document.getElementById('pagination-container'), data: object });
    }

    render({ parent, data }) {
        const { currentPage, totalPages, onClickEvent } = data;

        if (!parent) {
            return;
        }

        parent.innerHTML = ''; // Clear existing pagination

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 4);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            new Button({
                classes: currentPage === i ? ['active'] : [],
                text: i,
                parent: parent,
                onClick: onClickEvent
            });
        }
    }
}