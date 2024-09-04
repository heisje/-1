
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
        new SaleVM(formType, false, dataManager, res.Data, 10);
        return
    }
    const defaultData = {
        "COM_CODE": "80000",
        "IO_DATE": new Date().toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '').replace(/ /g, '-'),
        "QTY": 0,
        "PRICE": 0,
        "REMARKS": ""
    }
    new SaleVM(formType, false, dataManager, defaultData, 10);
});
