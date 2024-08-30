import { SaleApi } from '../Api/SaleAPI.js';
import { Button } from '../components/common/Button.js';
import { OPageState, OTableState } from '../ObservingUI/OState.js';
import { arrayToMap } from '../Utils/arrayToMap.js';
import { FormVM, NewOpenWindowButton } from './FormVM.js';

export class SaleVM extends FormVM {
    constructor(formType, dataManager, defaultData, pageSize = 10) {
        super(formType, dataManager, defaultData, pageSize);
    }

    _abstract_funcMapping() {
        this.GetSearchForm = GetSaleSearchForm;
        this.Api = SaleApi;
    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            NewOpenWindowButton('itemForm.html');
        }
        ProductGetInput();
        super._initFormButtons();
    }

    _init_listenMessage() {
        super._init_listenMessage();
        window.addEventListener("message", (event) => {
            if (event.data?.messageType === 'set-items') {
                SetItems({ items: event.data?.items });
            }
        });
    }

    // 검색 조건에 따라 테이블 데이터 로드 함수
    // async _virtual_loadSearch(pageNumber = 1) {
    //     const formObject = this.GetSearchForm();

    //     const totalData = await this.dataManager.searchSalesData(formObject); // 검색된 데이터의 페이지네이션 결과 로드
    //     const pagintionedData = this.dataManager.pagintionedData(totalData, pageNumber);
    //     const targetTable = document.getElementById('table-body');
    //     // 기존 데이터 삭제
    //     if (!targetTable) return;
    //     targetTable.innerHTML = '';
    //     OPageState.update({
    //         currentPage: pagintionedData?.currentPage,
    //         totalPages: pagintionedData?.totalPage,
    //         onClickEvent: async (index) => {
    //             await this._handleIndexPagination(index.target.textContent);
    //         }
    //     })
    //     OTableState.update(arrayToMap(pagintionedData?.items));
    // }
}

// GET
// 폼의 내용 To Objects
export function GetSaleSearchForm() {
    const items = document.getElementById('search-items');
    const buttons = items.querySelectorAll('button');
    // 각 버튼 요소의 data-id 값을 배열로 수집합니다.
    const itemIds = Array.from(buttons).map(button => button.getAttribute('data-id'));
    const formData = new FormData(document.getElementById('dataForm'));
    const dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });
    dataObject.itemIds = itemIds;

    return dataObject;
}

// Product 를 받아오는 input
function ProductGetInput() {
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

// 물품을 search-items에 넣어주는 함수
export function SetItems({ items }) {
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