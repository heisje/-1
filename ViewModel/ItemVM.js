
import { ProductApi } from '../Api/ProductAPI.js';
import { Button } from '../components/common/Button.js';
import { FormVM, NewOpenWindowButton } from './FormVM.js';

export class ItemVM extends FormVM {
    constructor(formType, search = false, dataManager, defaultData, pageSize = 10) {
        super(formType, search, dataManager, defaultData, pageSize);

    }

    _abstract_funcMapping() {
        this.GetSearchForm = GetProductSearchForm;
        this._handleSearchFormReset = HandleProductUpdateFormReset;
        this.Api = ProductApi;
    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            NewOpenWindowButton('itemForm.html');
        }

        super._initFormButtons();

        if (this.formType === 'update') {
            const prod_cd = document.getElementById('register-id');
            prod_cd.readOnly = true;

            const formButtons = document.getElementById('formButtons');
            if (!formButtons) return;

            // new Button({
            //     text: '사용중지',
            //     classes: ['is-use-button'],
            //     onClick: async () => {
            //         const button = document.querySelector('.is-use-button');
            //         const isUse = !button.getAttribute("data-is-use");
            //         button.setAttribute("data-is-use", isUse);
            //         const res = await this.Api.Put({
            //             PROD_CD: this.defaultData.Key.PROD_CD,
            //             IS_USE: isUse,
            //         });
            //         alert(res?.Message ?? "에러");
            //         button.textContent = isUse ? "사용중" : "사용금지";
            //         button.textContent = await this._virtual_loadSearch();
            //     },
            //     attributes: [{ qualifiedName: "data-is-use", value: true }],
            //     parent: formButtons
            // });
        }
    }


}

// Product용 SearchForm을 가져오는 함수
function GetProductSearchForm() {
    const formData = new FormData(document.getElementById('dataForm'));
    const dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });
    console.log("vdataObject!!!!!!!!!", dataObject);
    return dataObject;
}

function HandleProductUpdateFormReset(defaultData) {
    if (defaultData) {
        const input1 = document.querySelector('input[name="id"]');
        input1.value = defaultData?.Key.PROD_CD;

        const input2 = document.querySelector('input[name="name"]');
        input2.value = defaultData?.PROD_NM;

        const input3 = document.querySelector('input[name="price"]');
        input3.value = defaultData?.PRICE;

        const input4 = document.querySelector('input[name="IS_USE"]');
        input4.value = defaultData?.IS_USE;


    }
}
