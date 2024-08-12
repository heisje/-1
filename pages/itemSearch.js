
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemVM } from '../ViewModel/ItemVM.js';
import { CheckTableVM } from '../ViewModel/CheckTableVM.js';
import { OItemTableUI } from '../ObservingUI/OItemTable.js';
import { OCurrentData } from '../ObservingUI/OState.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getById(queryId) : {};


    const itemTable = new OItemTableUI();
    OCurrentData.register(itemTable);

    new ItemVM(formType, dataManager, defaultData, 10);
    new CheckTableVM();
});
