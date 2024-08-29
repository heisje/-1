import { Button } from '../components/common/Button.js';
import { FormVM, NewOpenWindowButton } from './FormVM.js';

export class ItemVM extends FormVM {
    constructor(formType, dataManager, defaultData, pageSize = 10) {
        super(formType, dataManager, defaultData, pageSize);
    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            NewOpenWindowButton('itemForm.html');
        }
        super._initFormButtons();
    }
}
