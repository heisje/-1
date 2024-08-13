import { Button } from '../components/common/Button.js';
import { FormVM } from './FormVM.js';

export class ItemVM extends FormVM {
    constructor(formType, dataManager, defaultData, pageSize = 10) {
        super(formType, dataManager, defaultData, pageSize);
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
                    { qualifiedName: 'data-href', value: 'itemForm.html' },
                    { qualifiedName: 'data-query-modal-type', value: 'post' }
                ]
            });
        }

        super._initFormButtons();
    }

}
