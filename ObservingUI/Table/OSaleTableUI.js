import { CheckBox } from "../../components/CheckBox.js";
import { Cell, OpenButton, Td } from "../../components/Td.js";
import { Data } from "../../data/data.js";
import { handleOpenWindow } from "../../modal/handleOpenWindow.js";

export class OSaleTableUI {
    update(object) {
        console.log('updated O');

        console.log(object);
        this.render({ parent: document.getElementById('table-body'), data: object });
    }
    // {
    //     "COM_CODE": "80000",
    //     "IO_DATE": "20230801",
    //     "IO_NO": 1,
    //     "PROD_CD": "P1",
    //     "PROD_NM": "P1 A",
    //     "QTY": 10.123456,
    //     "PRICE": 99.99,
    //     "REMARKS": "First sale entry"
    // }
    async render({ parent, data }) {
        try {
            parent.innerHTML = ''; // 기존 데이터 삭제

            let index = 0;
            for (const [key, item] of data.entries()) {
                const IO_DATE = item?.IO_DATE;
                const IO_NO = item?.IO_NO;
                const IO = `${IO_DATE}-${IO_NO}`
                const PROD_CD = item?.PROD_CD;
                const PROD_NM = item?.PROD_NM;
                const QTY = item?.QTY;
                const PRICE = item?.PRICE;
                const REMARKS = item?.REMARKS ?? "";

                const row = document.createElement('tr');
                row.setAttribute('id', IO); // id 할당

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

                //const cell = document.createElement('td');
                const UpdateButton = OpenButton(IO, 'saleForm.html');
                UpdateButton.addEventListener('click', handleOpenWindow);
                //cell.appendChild(UpdateButton);
                //row.appendChild(cell);

                new Td({
                    children: UpdateButton,
                    // text: QTY ?? '',
                    parent: row,
                    // attributes: [{ qualifiedName: "qty", value: QTY }],
                    classes: ["center"]
                });

                row.appendChild(Cell(PROD_CD));
                row.appendChild(Cell(PROD_NM));

                new Td({
                    text: QTY ?? '',
                    parent: row,
                    attributes: [{ qualifiedName: "qty", value: QTY }],
                    classes: ["right"]
                });
                new Td({
                    text: PRICE ?? '',
                    parent: row,
                    attributes: [{ qualifiedName: "price", value: PRICE }],
                    classes: ["right"]
                });

                // row.appendChild(Cell(QTY));
                // row.appendChild(Cell(PRICE));
                row.appendChild(Cell(REMARKS));

                parent.appendChild(row);

                index++;
            }
        } catch (e) {
            console.log(e);
        }
    }
}
