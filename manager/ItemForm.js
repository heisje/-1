import { Button } from '../components/Button.js';
import { ItemTableRow } from '../components/ItemTableRow.js';
import { handleOpenWindow } from '../modal/handleOpenWindow.js';
import { FormManager } from './FormManager.js';

export class ItemForm extends FormManager {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
        this.requiredKeys = ['name', 'id'];

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

    // override 행 생성
    _rowMaker(parent, data) {
        ItemTableRow({ parent, data, currentMapData: this.currentMapData });
    }
}
