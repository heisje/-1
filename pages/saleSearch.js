
import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { SaleVM } from "../ViewModel/SaleVM.js";
import { CheckTableVM } from '../ViewModel/CheckTableVM.js';
import { OTableState } from "../ObservingUI/OState.js";
import { OSaleTableUI } from "../ObservingUI/Table/OSaleTable.js";

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getById(queryId) : {};

    const tableUi = new OSaleTableUI();
    OTableState.register(tableUi);

    new SaleVM(formType, dataManager, defaultData, 10);

    new CheckTableVM();
});
