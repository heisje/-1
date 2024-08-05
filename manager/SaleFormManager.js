import { createCheckboxCell, createButton, createDefaultCell } from '../components/td.js';
import { FormManager } from './FormManager.js';

export class SaleFormManager extends FormManager {
    constructor(formSelector, formType = 'get', table, defaultData) {
        super(formSelector, formType, table, defaultData);
    }

    // _loadSearchData 메서드 오버라이드
    _rowMaker(parent, data) {
        console.log(parent, data.items, '흠');
        data.items.forEach((item) => {
            const row = document.createElement('tr');

            // 체크박스 셀 생성
            row.appendChild(createCheckboxCell(item));

            const cell = document.createElement('td');
            const UpdateButton = createButton(item?.date ?? '', 'saleForm.html')
            UpdateButton.addEventListener('click', this._handleOpenWindow);
            cell.appendChild(UpdateButton);
            row.appendChild(cell);

            // 나머지 셀 생성
            row.appendChild(createDefaultCell(item?.itemCode ?? ''));
            row.appendChild(createDefaultCell(item?.itemName ?? ''));
            row.appendChild(createDefaultCell(item?.count ?? ''));
            row.appendChild(createDefaultCell(item?.price ?? ''));
            row.appendChild(createDefaultCell(item?.description ?? ''));

            parent.appendChild(row);
        });
    }
}
