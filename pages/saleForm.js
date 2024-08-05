import { useQuery } from '../customhook/useQuery.js';
import { FormManager } from '../manager/FormManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'] ?? 'get';
    const formName = 'sales';
    const formDefaultData = {
        "date": queryData?.["date"] ?? "",
        "itemCode": queryData?.["itemCode"] ?? "",
        "count": queryData?.["count"] ?? "",
        "price": queryData?.["price"] ?? "",
        "description": queryData?.["description"] ?? "",
    }
    new FormManager('#dataForm', formType, formName, formDefaultData);
});
