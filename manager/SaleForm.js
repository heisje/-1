import { Button } from '../components/Button.js';
import { FuncButton } from '../components/FunButton.js';
import { Pagination } from '../components/Pagination.js';
import { CheckBox, OpenButton, Cell } from '../components/Td.js';
import { Data } from '../data/data.js';
import { Form } from './Form.js';

export class SaleForm extends Form {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
        this.requiredKeys = ['date', 'item', 'count', 'price'];
    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            const openWindowButton = new Button({ text: '신규', classes: ['primary-button', 'openWindow'], onClick: null, parent: formButtons });
            openWindowButton.button.setAttribute('data-href', 'saleForm.html');
            openWindowButton.button.setAttribute('data-query-modal-type', 'post');
        }

        super._initFormButtons();

        // TODO 제출 분리
        const searchInput = document.getElementById('item');
        const searchIcon = document.getElementById('searchIcon');

        if (searchInput && searchIcon) {
            searchInput.addEventListener('focus', () => {
                searchIcon.click();
                document.activeElement.blur();
            });
        }
        const fakeItemInput = document.getElementById('fake-item-input');
        const items = document.getElementById('search-items');
        if (fakeItemInput && items) {
            fakeItemInput.addEventListener('keydown', (event) => {
                event.preventDefault();
                // 백스페이스 키를 눌렀는지 확인합니다.
                if (event.key === 'Backspace') {
                    // 커서가 input 요소의 맨 앞에 위치했는지 확인합니다.
                    if (fakeItemInput.selectionStart === 0) {
                        // search-items 안의 모든 버튼 요소를 가져옵니다.
                        const buttons = items.getElementsByTagName('button');

                        // 버튼이 있을 경우 마지막 버튼을 제거합니다.
                        if (buttons.length > 0) {
                            items.removeChild(buttons[buttons.length - 1]);
                        }

                        // 기본 동작(텍스트 삭제)을 방지합니다.
                        event.preventDefault();
                    }
                }
            });
        }
    }

    _virtual_listenMessage() {
        super._virtual_listenMessage();
        window.addEventListener("message", (event) => {
            if (event.data?.messageType === 'set-items') {
                const container = document.getElementById('search-items');
                event?.data?.items.forEach((item) => {
                    const button = FuncButton({
                        text: `${item?.id}(${item?.name})`, parent: container,
                        attributes: [{ qualifiedName: 'data-id', value: item?.id }],
                        onClick: () => { button.remove() }
                    });
                    // button.addEventListener('click', () => { button.remove() });
                    const itemInput = document.getElementById('item');
                    if (itemInput) {
                        itemInput.value = event?.data?.items?.[0]?.id
                    }
                    const priceInput = document.getElementById('price');
                    if (priceInput) {
                        priceInput.value = event?.data?.items?.[0]?.price
                    }
                })

                // document.getElementById('item').value = event?.data?.ids;
            }
        });
    }

    // GET
    _getFormData() {
        const items = document.getElementById('search-items');
        const buttons = items.querySelectorAll('button');
        // 각 버튼 요소의 data-id 값을 배열로 수집합니다.
        const itemIds = Array.from(buttons).map(button => button.getAttribute('data-id'));
        console.log(itemIds);

        const formData = new FormData(this.form);
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });
        dataObject.itemIds = itemIds;

        return dataObject;
    }

    // 검색 조건에 따라 테이블 데이터 로드 함수
    _loadSearchData(pageNumber = 1) {
        const formObject = this._getFormData();

        const totalData = this.dataManager.searchSalesData(formObject); // 검색된 데이터의 페이지네이션 결과 로드
        const pagintionedData = this.dataManager.pagintionedData(totalData, pageNumber);

        // 기존 데이터 삭제
        if (!this.tbody) return;
        this.tbody.innerHTML = '';
        Pagination(pagintionedData?.currentPage, pagintionedData?.totalPage,
            (index) => {
                this._handleIndexPagination(index.target.textContent);
            }
        );

        this._updateCurrentMapData(pagintionedData?.items);
        console.log('currentData', this.currentMapData);
        this._rowMaker(this.tbody, pagintionedData);
    }

    // _loadSearchData 메서드 오버라이드
    _rowMaker(parent, data) {
        data.items.forEach((item) => {
            try {
                const row = document.createElement('tr');
                row.setAttribute('id', item?.id); // id 할당

                // 체크박스 셀 생성
                row.appendChild(CheckBox(item));

                const cell = document.createElement('td');
                const UpdateButton = OpenButton(item?.date + '-' + item?.id?.slice(0, 2) ?? '', 'saleForm.html')
                UpdateButton.addEventListener('click', this._handleOpenWindow);
                cell.appendChild(UpdateButton);
                row.appendChild(cell);

                // 나머지 셀 생성
                const itemDataManager = new Data('item');

                const { id, name } = itemDataManager.getDataById(item?.item);
                row.appendChild(Cell(id ?? ''));
                row.appendChild(Cell(name ?? ''));

                row.appendChild(Cell(item?.count ?? ''));
                row.appendChild(Cell(item?.price ?? ''));
                row.appendChild(Cell(item?.description ?? ''));

                parent.appendChild(row);
            } catch (e) { console.log(e); }

        });
    }
}
