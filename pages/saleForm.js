
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { SaleVM } from '../ViewModel/SaleVM.js';


document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? await dataManager.getById(queryId) : new Map();

    new SaleVM(formType, dataManager, defaultData, 10);
});
