import { SaleApi } from '../Api/SaleAPI.js';
import { Button } from '../components/common/Button.js';
import { OPageState, OTableState } from '../ObservingUI/OState.js';
import { arrayToMap } from '../Utils/arrayToMap.js';
import { FormVM, NewOpenWindowButton } from './FormVM.js';

export class SaleVM extends FormVM {
    constructor(formType, search = false, dataManager, defaultData, pageSize = 10) {
        super(formType, search, dataManager, defaultData, pageSize);
    }

    _abstract_funcMapping() {
        this.GetSearchForm = GetSaleSearchForm;
        this.Api = SaleApi;

        this._handleSearchFormReset = HandleSaleUpdateFormReset;
        console.log("맵핑완료");

    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            NewOpenWindowButton('saleForm.html');
        } if (this.formType !== 'update') {
            document.getElementById('IO_NO')?.remove();
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
    console.log("GetSaleSearchForm", dataObject);


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
    items.forEach((item, idx) => {
        const PROD_CD = item?.Key?.PROD_CD;
        const PROD_NM = item?.PROD_NM;
        const PRICE = item?.PRICE;
        const button = new Button({
            text: `${PROD_CD}(${PROD_NM})`, parent: container,
            attributes: [{ qualifiedName: 'data-id', value: PROD_CD }],
        });

        button.addRemoveEventListener();

        // button.addEventListener('click', () => { button.remove() });
        const itemInput = document.getElementById('item');
        if (itemInput) {
            itemInput.value = PROD_CD;
        }
        const priceInput = document.getElementById('price');
        if (priceInput) {
            priceInput.value = PRICE;
        }
    })

}
// {
//     "COM_CODE": "80000",
//     "IO_DATE": "20230801",
//     "IO_NO": 1,
//     "PROD_CD": "P1",
//     "PROD_NM": "P1 A",
//     "QTY": 10.123456,
//     "PRICE": 99.99,
//     "REMARKS": "First sale entry"
// }
function HandleSaleUpdateFormReset(defaultData) {
    if (defaultData) {
        const input1 = document.querySelector('input[name="date"]');
        input1.value = defaultData?.IO_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

        SetItems({
            items: [{
                Key: {
                    PROD_CD: defaultData?.PROD_CD
                },
                PROD_NM: defaultData?.PROD_NM
            }]
        })

        const input2 = document.querySelector('input[name="item"]');
        input2.value = defaultData?.PROD_CD;

        const input3 = document.querySelector('input[name="count"]');
        input3.value = defaultData?.QTY;

        const input4 = document.querySelector('input[name="price"]');
        input4.value = defaultData?.PRICE;

        const input5 = document.querySelector('input[name="description"]');
        input5.value = defaultData?.REMARKS ?? "";

        const input6 = document.querySelector('input[name="IO_NO"]');
        input6.value = defaultData?.IO_NO;
    }
}