import { useQuery } from '../customhook/useQuery.js';
import { ItemFormManager } from '../manager/ItemFormManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'] ?? 'get';
    const formName = 'item';
    const formDefaultData = {
        "itemCode": queryData?.["itemCode"] ?? "",
        "itemName": queryData?.["itemName"] ?? ""
    }
    new ItemFormManager('#dataForm', formType, formName, formDefaultData);
});
