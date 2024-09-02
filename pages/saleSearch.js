
import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { SaleVM } from "../ViewModel/SaleVM.js";
import { CheckTableVM } from '../ViewModel/CheckTableVM.js';
import { OPageState, OTableState } from "../ObservingUI/OState.js";
import { OSaleTableUI } from "../ObservingUI/Table/OSaleTableUI.js";
import { OPaginationUI } from "../ObservingUI/Pagination/OPaginationUI.js";

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    const dataManager = new Data('sales');

    // Model View 1:1 매칭
    const tableUi = new OSaleTableUI();
    OTableState.register(tableUi);
    const paginationUi = new OPaginationUI();
    OPageState.register(paginationUi);

    new SaleVM(formType, true, dataManager, null, 10);

    new CheckTableVM();
});
