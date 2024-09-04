
import { ProductApi } from '../Api/ProductAPI.js';
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { ItemVM } from '../ViewModel/ItemVM.js';

document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('item');
    const queryId = queryData?.id;
    // modal-type=update

    if (queryData?.['modal-type'] === "update") {
        const res = await ProductApi.Get({ key: queryId });
        new ItemVM(formType, false, dataManager, res?.Data, 10);
        return;
    }
    const defaultData = {
        "PROD_NM": "",
        "PRICE": 0.0,
        "Key": {
            "COM_CODE": "80000",
            "PROD_CD": ""
        }
    }
    new ItemVM(formType, false, dataManager, defaultData, 10);
});
