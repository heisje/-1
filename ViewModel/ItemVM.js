
import { ProductApi } from '../Api/ProductAPI.js';
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
    }
}