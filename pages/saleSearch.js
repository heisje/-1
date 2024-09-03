
import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { SaleVM } from "../ViewModel/SaleVM.js";
import { CheckTableVM } from '../ViewModel/CheckTableVM.js';
import { OPageState, OSortState, OTableState } from "../ObservingUI/OState.js";
import { OSaleTableUI } from "../ObservingUI/Table/OSaleTableUI.js";
import { OPaginationUI } from "../ObservingUI/Pagination/OPaginationUI.js";
import { InitOrder } from "../ViewModel/SearchTable.js";
import { OSortUI } from "../ObservingUI/Sort/OSortUI.js";

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    const dataManager = new Data('sales');

    // Model View 1:1 매칭
    const tableUi = new OSaleTableUI();
    OTableState.register(tableUi);
    const paginationUi = new OPaginationUI();
    OPageState.register(paginationUi);

    // Sort상태 초기화
    const defaultOrder = new Map([
        ["s.IO_NO", "DESC"],
        ["s.IO_DATE", "DESC"],
    ]);
    OSortState.update(defaultOrder);
    const sortUI = new OSortUI();
    OSortState.register(sortUI);

    new SaleVM(formType, true, dataManager, null, 10);

    new CheckTableVM();
});
