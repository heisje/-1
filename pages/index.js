import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { SaleForm } from "../manager/SaleForm.js";

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? dataManager.getDataById(queryId) : {};


    new SaleForm('#dataForm', formType, dataManager, defaultData);
});
