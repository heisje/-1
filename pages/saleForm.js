import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { SaleFormManager } from '../manager/saleFormManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? dataManager.getDataById(queryId) : {};

    new SaleFormManager('#dataForm', formType, dataManager, defaultData);
});
