import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemForm } from '../manager/ItemForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    const defaultData = queryId ? dataManager.getDataById(queryId) : {};

    new ItemForm('#dataForm', formType, dataManager, defaultData);
});
