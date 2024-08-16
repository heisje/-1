
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemVM } from '../ViewModel/ItemVM.js';
import { CheckTableVM } from '../ViewModel/CheckTableVM.js';
import { OItemTableUI } from '../ObservingUI/Table/OItemTableUI.js';
import { OPageState, OTableState } from '../ObservingUI/OState.js';
import { OPaginationUI } from '../ObservingUI/Pagination/OPaginationUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getById(queryId) : new Map();

    // Model View 1:1 매칭
    const itemTable = new OItemTableUI();
    OTableState.register(itemTable);
    const paginationUi = new OPaginationUI();
    OPageState.register(paginationUi);

    new ItemVM(formType, dataManager, defaultData, 10);
    new CheckTableVM();
});
