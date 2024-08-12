import { Button } from "./common/Button.js";

export function Pagination(currentPage, totalPages, onClickEvent) {
    const pagination = document.getElementById('pagination-container');

    if (!pagination) {
        return;
    }

    pagination.innerHTML = ''; // Clear existing pagination

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
            parent: pagination,
            onClick: onClickEvent
        });
    }
}
