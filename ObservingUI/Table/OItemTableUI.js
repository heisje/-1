import { CheckBox } from "../../components/CheckBox.js";
import { Button } from "../../components/common/Button.js";
import { Cell, OpenButton, Td } from "../../components/Td.js";
import { useQuery } from "../../customhook/useQuery.js";
import { handleOpenWindow } from "../../modal/handleOpenWindow.js";
import CheckBoxState from "../../state/checkBoxState.js";

export class OItemTableUI {
    update(object) {
        console.log('updated O');
        console.log(object);
        this.render({ parent: document.getElementById('table-body'), data: object });
    }

    async render({ parent, data }) {
        if (data.size <= 0) {
            return;
        }

        CheckBoxState.changeKeyState({ selectedIds: new Set() });
        const checkedCount = useQuery()?.['get-count'];
        const modalType = useQuery()?.['modal-type'];

        let index = 0;

        for (const [key, item] of data.entries()) {
            const PROD_CD = item?.Key?.PROD_CD;
            const PRICE = item?.PRICE ?? 0;
            const PROD_NM = item?.PROD_NM ?? "NULL";
            const IS_USE = item?.IS_USE ?? true;

            const row = document.createElement('tr');
            row.setAttribute('id', PROD_CD); // id 할당
            if (IS_USE === false) {
                row.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // 빨간색 음영
            }
            // 체크박스 셀 생성
            const checkboxTd = document.createElement('td');
            new CheckBox({
                onClick: (event) => {
                    const parrentCheckBox = document.getElementById('table-parrent-checkbox');
                    if (!event.target.checked) {
                        parrentCheckBox.checked = false;
                    }
                    const { selectedIds } = CheckBoxState.getState();

                    if (event.target.checked) {
                        selectedIds.add(PROD_CD);
                    } else {
                        selectedIds.delete(PROD_CD);
                    }

                    // 체크된 항목의 수가 제한을 초과하면 체크 해제
                    if (selectedIds.size > checkedCount) {
                        alert(`최대 ${checkedCount}개 항목만 선택할 수 있습니다.`);
                        event.target.checked = false;
                        selectedIds.delete(PROD_CD);
                    }
                    CheckBoxState.changeKeyState({ selectedIds: selectedIds });
                },
                index: index + 1,
                parent: checkboxTd
            });
            row.appendChild(checkboxTd);

            // 나머지 셀 생성
            if (modalType) {
                const celltd = document.createElement('td');
                new Button({
                    text: `${PROD_CD}`,
                    onClick: () => {
                        const message = {
                            // TODO: 메세지 타입 분할
                            messageType: 'set-items',
                            items: [data.get(PROD_CD)],
                            ids: PROD_CD,
                        }

                        window.opener.postMessage(message, window.location.origin);
                        window.close();
                    }, parent: celltd
                });
                row.appendChild(celltd);
            } else {
                new Td({
                    text: PROD_CD ?? '',
                    parent: row
                });
            }

            new Td({
                text: PROD_NM ?? '',
                parent: row
            });

            const UpdateButton = OpenButton('수정', 'itemForm.html');
            UpdateButton.addEventListener('click', handleOpenWindow);

            new Td({
                text: PRICE ?? '',
                parent: row,
                attributes: [{ qualifiedName: "price", value: PRICE }],
                classes: ["right"]
            });

            new Td({
                children: UpdateButton,
                parent: row,
                attributes: [{ qualifiedName: "name", value: PROD_NM }]
            });

            parent.appendChild(row);
            index++;
        }
    }
}
