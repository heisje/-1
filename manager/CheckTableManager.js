import { useQuery } from "../customhook/useQuery.js";
import CheckBoxState from "../state/checkBoxState.js";

export class CheckTableManager {
    constructor() {
        this.selectedIds = [];
        this.maxCountSelect = 0;
        this.countSelected = 0;
        this.tableBody = document.getElementById('table-body');
        this.parrentCheckBox = document.getElementById('table-parrent-checkbox');
        this.childrenCheckBoxes = this.setAllChildrenCheckBox();
        CheckBoxState.getState().selectedIds;
        const query = useQuery();
        const selectCount = parseInt(query?.['get-count']);

        if (selectCount >= 0) {
            this.parrentCheckBox.style.display = 'none';
            this.childrenCheckBoxes.forEach((checkbox) => {

                checkbox.addEventListener('change', (event) => {
                    const checkedBoxes = this.getCheckedCheckBoxes();
                    if (checkedBoxes.length > selectCount) {
                        event.target.checked = false;
                        alert(`최대 ${selectCount}개 항목만 선택할 수 있습니다.`);
                    }
                });
            });
        }

        this.childrenCheckBoxes.forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                if (!event.target.checked) {
                    this.parrentCheckBox.checked = false;
                }
            });
        });

        if (this.parrentCheckBox) {
            this.parrentCheckBox.addEventListener("click", (event) => {
                const isChecked = event.target.checked;
                this.childrenCheckBoxes.forEach((checkbox) => {
                    checkbox.checked = isChecked;
                });
            });
        }
    }

    // 
    setAllChildrenCheckBox() {
        this.childrenCheckBoxes = this.tableBody.querySelectorAll('input[type="checkbox"]');
        return this.childrenCheckBoxes;
    }

    getCheckedCheckBoxes() {
        const CheckedCheckBoxes = []
        if (this.childrenCheckBoxes.length > 0) {
            this.childrenCheckBoxes.forEach((checkbox, index) => {
                if (checkbox.checked) {
                    CheckedCheckBoxes.push(checkbox);
                }
            })
        }
        return CheckedCheckBoxes;
    }
}
