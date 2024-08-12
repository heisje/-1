import { Data } from "../data/data.js";
import { handleOpenWindow } from "../modal/handleOpenWindow.js";
import { CCheckBox } from "./CheckBox.js";
import { Cell, OpenButton } from "./Td.js";

export async function SaleTableRow({ parent, data }) {
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];

        try {
            const row = document.createElement('tr');
            row.setAttribute('id', item?.id); // id 할당

            // 체크박스 셀 생성
            const checkboxTd = document.createElement('td');
            new CCheckBox({
                onClick: (event) => {
                    const parrentCheckBox = document.getElementById('table-parrent-checkbox');
                    if (!event.target.checked) {
                        parrentCheckBox.checked = false;
                    }
                },
                index: i + 1,
                parent: checkboxTd
            });
            row.appendChild(checkboxTd);

            const cell = document.createElement('td');
            const UpdateButton = OpenButton(item?.date + '-' + item?.id?.slice(0, 2) ?? '', 'saleForm.html')
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
        } catch (e) {
            console.log(e);
        }
    }
}