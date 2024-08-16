import { useQuery } from "../customhook/useQuery.js";

export class CheckTableVM {
    constructor() {
        this.parrentCheckBox = document.getElementById('table-parrent-checkbox');

        const query = useQuery();
        const selectCount = parseInt(query?.['get-count']);

        if (selectCount > 0) {
            this.parrentCheckBox.style.display = 'none';
        }

        this.parrentCheckBox?.addEventListener("click", (event) => {
            const childCheckboxes = document.querySelectorAll('input[type="checkbox"]');
            const isChecked = event.target.checked;

            childCheckboxes.forEach((checkbox) => {
                checkbox.checked = isChecked;
                checkbox.dispatchEvent(new Event('change'));
            });
        });
    }

    static getSelectedRowIds(htmlElement) {
        const selectedIds = [];
        htmlElement.querySelectorAll('input[type="checkbox"]:checked')?.forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (row && row.id) {
                selectedIds.push(row.id);
            }
        });
        return selectedIds;
    }
}
