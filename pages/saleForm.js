
import { SaleApi } from '../Api/SaleAPI.js';
import { useQuery } from '../customhook/useQuery.js';
import { Data } from '../data/data.js';
import { SaleVM } from '../ViewModel/SaleVM.js';


document.addEventListener('DOMContentLoaded', async () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];
    const queryId = queryData?.id;
    // 데이터
    const dataManager = new Data('sales');
    if (queryData?.['modal-type'] === "update") {

        const res = await SaleApi.Get({ key: queryId });
        console.log("res", res);
        new SaleVM(formType, false, dataManager, res.Data, 10);
        return
    }

    new SaleVM(formType, false, dataManager, null, 10);
});
