
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemForm } from '../manager/ItemForm.js';
import { CheckTableManager } from '../manager/CheckTableManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getDataById(queryId) : {};

    const perrentCheckBox = document.getElementById('table-parrent-checkbox');
    if (perrentCheckBox) {
        console.log(perrentCheckBox);
        perrentCheckBox.addEventListener("click", (event) => {
            const childCheckboxes = document.getElementById('table-body').querySelectorAll('input[type="checkbox"]');
            const isChecked = event.target.checked;
            childCheckboxes.forEach((checkbox) => {
                checkbox.checked = isChecked;
            });
        });
    }

    new ItemForm('#dataForm', formType, dataManager, defaultData, 10);
    new CheckTableManager();
});
