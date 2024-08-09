
import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { SaleForm } from "../manager/SaleForm.js";
import { CheckTableManager } from '../manager/CheckTableManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getDataById(queryId) : {};

    const perrentCheckBox = document.getElementById('table-parrent-checkbox');
    if (perrentCheckBox) {
        console.log(perrentCheckBox);
        perrentCheckBox.addEventListener("change", (event) => {
            const childCheckboxes = document.getElementById('table-body').querySelectorAll('input[type="checkbox"]');
            const isChecked = event.target.checked;
            childCheckboxes.forEach((checkbox) => {
                checkbox.checked = isChecked;
            });
        });
    }

    new SaleForm('#dataForm', formType, dataManager, defaultData, 10);
    new CheckTableManager();
});
