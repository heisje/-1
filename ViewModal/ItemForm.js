import { Button } from '../components/common/Button.js';
import { ItemTableRow } from '../components/ItemTableRow.js';
import { FormManager } from './FormManager.js';

export class ItemForm extends FormManager {
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

    // override 행 생성
    _virtual_rowMaker(parent, data) {
        ItemTableRow({ parent, data, currentMapData: this.currentMapData });
    }
}
