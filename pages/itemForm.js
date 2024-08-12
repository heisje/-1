
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemVM } from '../ViewModel/ItemVM.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getById(queryId) : {};

    new ItemVM(formType, dataManager, defaultData, 10);
});
