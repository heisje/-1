import { Button } from '../components/Button.js';
import { CheckBox, OpenButton, Cell } from '../components/td.js';
import { Form } from './Form.js';

export class ItemForm extends Form {
    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        super(formSelector, formType, dataManager, defaultData, pageSize);
        this.requiredKeys = ['name', 'id'];

    }

    // override
    _initFormButtons() {
        if (this.formType !== 'update' && this.formType !== 'post') {
            const openWindowButton = new Button({ text: '신규', classes: ['primary-button', 'openWindow'], onClick: null, parent: formButtons });
            openWindowButton.button.setAttribute('data-href', 'itemForm.html');
            openWindowButton.button.setAttribute('data-query-modal-type', 'post');
        }

        super._initFormButtons();
    }

    // override 행 생성
    _rowMaker(parent, data) {
        data.items.forEach((item) => {
            const row = document.createElement('tr');
            row.setAttribute('id', item?.id); // id 할당

            // 체크박스 셀 생성
            row.appendChild(CheckBox(item));
            // 나머지 셀 생성
            const celltd = document.createElement('td');
            new Button({
                text: `${item?.id}`,
                onClick: () => {
                    const message = {
                        // TODO: 메세지 타입 분할
                        messageType: 'set-items',
                        ids: [item?.id],
                    }
                    window.opener.postMessage(message, window.location.origin);
                    window.close();
                }, parent: celltd
            });
            row.appendChild(celltd);
            row.appendChild(Cell(item?.name ?? ''));

            const cell = document.createElement('td');
            const UpdateButton = OpenButton('수정', 'itemForm.html')
            UpdateButton.addEventListener('click', this._handleOpenWindow);
            cell.appendChild(UpdateButton);
            row.appendChild(cell);

            parent.appendChild(row);
        });
    }
}
