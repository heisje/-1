import { useQuery } from "../customhook/useQuery.js";
import { FormManager } from "../manager/FormManager.js";
import { SaleFormManager } from "../manager/saleFormManager.js";

document.addEventListener('DOMContentLoaded', () => {
    // 초기 로드 시 1페이지 데이터 삽입

    const queryData = useQuery();
    const formType = queryData?.['modal-type'] ?? 'get';
    const formName = 'sales';
    const formDefaultData = {
        "date": queryData?.["date"] ?? "",
        "itemCode": queryData?.["itemCode"] ?? "",
        "itemName": queryData?.["itemName"] ?? "",
        "count": queryData?.["count"] ?? "",
        "price": queryData?.["price"] ?? "",
        "description": queryData?.["description"] ?? "",
    }
    new SaleFormManager('#dataForm', formType, formName, formDefaultData);
});


// 선택된 모든 체크박스를 선택하거나 선택 해제하는 함수
function selectAll(source) {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}