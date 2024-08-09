import { useQuery } from "../customhook/useQuery.js";
import CheckBoxState from "../state/checkBoxState.js";

export class CheckTableManager {
    constructor() {
        this.selectedIds = [];
        this.maxCountSelect = 0;
        this.countSelected = 0;
        this.tableBody = document.getElementById('table-body');
        this.parrentCheckBox = document.getElementById('table-parrent-checkbox');
        this._setEventChildrenCheckBox();
        this._initRender();
    }



    _setEventChildrenCheckBox() {
        this.childrenCheckBoxes = this._setAllChildrenCheckBox();

        CheckBoxState.getState().selectedIds;
        const query = useQuery();
        const selectCount = parseInt(query?.['get-count']);

        console.log(this.childrenCheckBoxes);
        if (selectCount >= 0) {
            this.parrentCheckBox.style.display = 'none';
            // this.tableBody.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            //     checkbox.addEventListener('change', (event) => {
            //         const checkedBoxes = this.tableBody.querySelectorAll('input[type="checkbox"]:checked');
            //         console.log(checkedBoxes);
            //         if (checkedBoxes.length > selectCount) {
            //             event.target.checked = false;
            //             alert(`최대 ${selectCount}개 항목만 선택할 수 있습니다.`);
            //         }
            //     });
            // });
        }


        const perrentCheckBox = document.getElementById('table-parrent-checkbox');
        if (perrentCheckBox) {
            perrentCheckBox.addEventListener("click", (event) => {
                const childCheckboxes = perrentCheckBox.querySelectorAll('input[type="checkbox"]');
                const isChecked = event.target.checked;
                childCheckboxes.forEach((checkbox) => {
                    checkbox.checked = isChecked;
                });
            });
        }
    }

    // 
    _setAllChildrenCheckBox = () => {
        this.childrenCheckBoxes = this.tableBody.querySelectorAll('input[type="checkbox"]');
        return this.childrenCheckBoxes;
    }

    _getCheckedCheckBoxes = () => {
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

    _initRender() {
        const perrentCheckBox = document.getElementById('table-parrent-checkbox');
        if (perrentCheckBox) {
            console.log(perrentCheckBox);
            perrentCheckBox.addEventListener("change", (event) => {
                const childCheckboxes = document.getElementById('table-body').querySelectorAll('input[type="checkbox"]');
                const isChecked = event.target.checked;
                childCheckboxes.forEach((checkbox) => {
                    checkbox.checked = isChecked;
                });
            });
        }
    }
}
