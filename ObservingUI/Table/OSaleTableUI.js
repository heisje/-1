import { CheckBox } from "../../components/CheckBox.js";
import { Cell, OpenButton } from "../../components/Td.js";
import { Data } from "../../data/data.js";
import { handleOpenWindow } from "../../modal/handleOpenWindow.js";

export class OSaleTableUI {
    update(object) {
        console.log('updated O');
        console.log(object);
        this.render({ parent: document.getElementById('table-body'), data: object });
    }

    async render({ parent, data }) {
        console.log('inner', data, data.size);
        try {
            let index = 0;
            for (const [_, item] of data.entries()) {
                console.log('item', item);
                const row = document.createElement('tr');
                row.setAttribute('id', item?.id); // id 할당

                // 체크박스 셀 생성
                const checkboxTd = document.createElement('td');
                new CheckBox({
                    onClick: (event) => {
                        const parrentCheckBox = document.getElementById('table-parrent-checkbox');
                        if (!event.target.checked) {
                            parrentCheckBox.checked = false;
                        }
                    },
                    index: index + 1,
                    parent: checkboxTd
                });
                row.appendChild(checkboxTd);

                const cell = document.createElement('td');
                const UpdateButton = OpenButton(item?.date + '-' + item?.id?.slice(0, 2) ?? '', 'saleForm.html');
                UpdateButton.addEventListener('click', handleOpenWindow);
                cell.appendChild(UpdateButton);
                row.appendChild(cell);

                // 나머지 셀 생성
                const itemDataManager = new Data('item');
                const { id, name } = await itemDataManager.getById(item?.item);
                row.appendChild(Cell(id ?? ''));
                row.appendChild(Cell(name ?? ''));

                row.appendChild(Cell(item?.count ?? ''));
                row.appendChild(Cell(item?.price ?? ''));
                row.appendChild(Cell(item?.description ?? ''));

                parent.appendChild(row);

                index++;
            }
        } catch (e) {
            console.log(e);
        }
    }
}
