
import { FormVM, NewOpenWindowButton } from './FormVM.js';

export class ItemVM extends FormVM {
    constructor(formType, dataManager, defaultData, pageSize = 10) {
        super(formType, dataManager, defaultData, pageSize);

    }

    _abstract_funcMapping() {
        this.GetSearchForm = GetProductSearchForm;
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
    return dataObject;
}