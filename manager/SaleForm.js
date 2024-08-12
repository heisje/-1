import { Button } from '../components/Button.js';
import { Pagination } from '../components/Pagination.js';
import { SaleTableRow } from '../components/SaleTableRow.js';
import { arrayToMap } from '../util/arrayToMap.js';
import { FormManager } from './FormManager.js';

export class SaleForm extends FormManager {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
    }
    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            new Button({
                text: '신규',
                classes: ['primary-button', 'openWindow'],
                onClick: null,
                parent: formButtons,
                attributes: [
                    { qualifiedName: 'data-href', value: 'saleForm.html' },
                    { qualifiedName: 'data-query-modal-type', value: 'post' }
                ]
            });
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

    _init_virtual_listenMessage() {
        super._init_virtual_listenMessage();
        window.addEventListener("message", (event) => {
            if (event.data?.messageType === 'set-items') {
                this._setItems({ items: event.data?.items });
            }
        });
    }

    _setItems({ items }) {
        // 물품을 search-items에 넣어주는 함수
        const container = document.getElementById('search-items');
        container.innerHTML = ''; // 기존 내용을 비웁니다.
        items.forEach((item) => {
            const button = new Button({
                text: `${item?.id}(${item?.name})`, parent: container,
                attributes: [{ qualifiedName: 'data-id', value: item?.id }],
            });
            button.addRemoveEventListener();

            // button.addEventListener('click', () => { button.remove() });
            const itemInput = document.getElementById('item');
            if (itemInput) {
                itemInput.value = items?.[0]?.id
            }
            const priceInput = document.getElementById('price');
            if (priceInput) {
                priceInput.value = items?.[0]?.price
            }
        })

    }

    // GET
    _getFormData() {
        const items = document.getElementById('search-items');
        const buttons = items.querySelectorAll('button');
        // 각 버튼 요소의 data-id 값을 배열로 수집합니다.
        const itemIds = Array.from(buttons).map(button => button.getAttribute('data-id'));
        const formData = new FormData(this.form);
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });
        dataObject.itemIds = itemIds;

        return dataObject;
    }

    // 검색 조건에 따라 테이블 데이터 로드 함수
    async _loadSearch(pageNumber = 1) {
        const formObject = this._getFormData();

        const totalData = await this.dataManager.searchSalesData(formObject); // 검색된 데이터의 페이지네이션 결과 로드
        const pagintionedData = this.dataManager.pagintionedData(totalData, pageNumber);

        // 기존 데이터 삭제
        if (!this.tbody) return;
        this.tbody.innerHTML = '';
        Pagination(pagintionedData?.currentPage, pagintionedData?.totalPage,
            async (index) => {
                await this._handleIndexPagination(index.target.textContent);
            }
        );
        this.currentMapData = arrayToMap(pagintionedData?.items);
        console.log('생성됨', this.currentMapData, pagintionedData);
        this._virtual_rowMaker(this.tbody, pagintionedData);
    }

    _handleSearchFormReset() {
        console.log(this.defaultData);
        super._handleSearchFormReset();
    }

    // _loadSearch 메서드 오버라이드
    _virtual_rowMaker(parent, data) {
        SaleTableRow({ parent, data });
    }

}
