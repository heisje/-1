
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
        console.log(res);
        new ItemVM(formType, false, dataManager, res?.Data, 10);
        return;
    }

    new ItemVM(formType, false, dataManager, null, 10);
});
