import { Button } from '../components/Button.js';
import { createCheckboxCell, createButton, createDefaultCell } from '../components/td.js';
import { FormManager } from './FormManager.js';

export class ItemFormManager extends FormManager {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
    }
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            const openWindowButton = new Button({ text: '신규', classes: ['primary-button', 'openWindow'], onClick: null, parent: formButtons });
            openWindowButton.button.setAttribute('data-href', 'itemForm.html');
            openWindowButton.button.setAttribute('data-query-modal-type', 'post');
        }

        super._initFormButtons();
    }

    // _loadSearchData 메서드 오버라이드
    _rowMaker(parent, data) {
        // console.log("Form_ItemrowMaker", data);
        data.items.forEach((item) => {
            const row = document.createElement('tr');
            row.setAttribute('id', item?.id); // id 할당

            // 체크박스 셀 생성
            row.appendChild(createCheckboxCell(item));
            // 나머지 셀 생성
            row.appendChild(createDefaultCell(item?.id ?? ''));
            row.appendChild(createDefaultCell(item?.name ?? ''));

            const cell = document.createElement('td');
            const UpdateButton = createButton('수정', 'itemForm.html')
            UpdateButton.addEventListener('click', this._handleOpenWindow);
            cell.appendChild(UpdateButton);
            row.appendChild(cell);

            parent.appendChild(row);
        });
    }
}
