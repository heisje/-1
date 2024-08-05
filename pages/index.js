import { useQuery } from "../customhook/useQuery.js";
import { Data } from "../data/data.js";
import { FormManager } from "../manager/FormManager.js";
import { SaleFormManager } from "../manager/saleFormManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const queryData = useQuery();
    const formType = queryData?.['modal-type'];

    // 데이터
    const dataManager = new Data('sales');
    const queryId = queryData?.id;
    const defaultData = queryId ? dataManager.getDataById(queryId) : {};

    new SaleFormManager('#dataForm', formType, dataManager, defaultData);
});


// 선택된 모든 체크박스를 선택하거나 선택 해제하는 함수
function selectAll(source) {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}