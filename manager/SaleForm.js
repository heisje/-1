import { Button } from '../components/Button.js';
import { createCheckboxCell, createButton, createDefaultCell } from '../components/td.js';
import { Data } from '../data/data.js';
import { Form } from './Form.js';

export class SaleForm extends Form {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
        this.requiredKeys = ['date', 'item', 'count', 'price'];
    }

    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            const openWindowButton = new Button({ text: '신규', classes: ['primary-button', 'openWindow'], onClick: null, parent: formButtons });
            openWindowButton.button.setAttribute('data-href', 'saleForm.html');
            openWindowButton.button.setAttribute('data-query-modal-type', 'post');
        }

        super._initFormButtons();
    }

    // 검색 조건에 따라 테이블 데이터 로드 함수
    _loadSearchData(pageNumber = 1) {
        const formObject = this._getFormData();
        console.log('이걸로 검색', formObject);

        const data = this.dataManager.paginationSalesSearchData(formObject, pageNumber); // 검색된 데이터의 페이지네이션 결과 로드

        // 기존 데이터 삭제
        if (!this.tbody) return;
        this.tbody.innerHTML = '';

        this._rowMaker(this.tbody, data);
    }



    // _loadSearchData 메서드 오버라이드
    _rowMaker(parent, data) {
        // console.log("Form_SalerowMaker", data);
        data.items.forEach((item) => {
            const row = document.createElement('tr');
            row.setAttribute('id', item?.id); // id 할당

            // 체크박스 셀 생성
            row.appendChild(createCheckboxCell(item));

            const cell = document.createElement('td');
            const UpdateButton = createButton(item?.date + '-' + item?.id.slice(0, 2) ?? '', 'saleForm.html')
            UpdateButton.addEventListener('click', this._handleOpenWindow);
            cell.appendChild(UpdateButton);
            row.appendChild(cell);

            // 나머지 셀 생성
            const itemDataManager = new Data('item');

            const { id, name } = itemDataManager.getDataById(item?.item);
            row.appendChild(createDefaultCell(id ?? ''));
            row.appendChild(createDefaultCell(name ?? ''));

            row.appendChild(createDefaultCell(item?.count ?? ''));
            row.appendChild(createDefaultCell(item?.price ?? ''));
            row.appendChild(createDefaultCell(item?.description ?? ''));

            parent.appendChild(row);
        });
    }
}
