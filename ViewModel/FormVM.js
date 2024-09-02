import { Button } from "../components/common/Button.js";
import { Data } from "../data/data.js";
import { arrayToMap } from "../Utils/arrayToMap.js";
import { handleOpenWindow } from "../modal/handleOpenWindow.js";
import { HeaderByModalType } from "../components/HeaderText.js";
import { CheckTableVM } from "./CheckTableVM.js";
import { OPageState, OTableState } from "../ObservingUI/OState.js";
import { SendMessage } from "../Events/Message.js";
import { ProductApi } from "../Api/ProductAPI.js";
import { useQuery } from "../customhook/useQuery.js";


// 행위대리자
export class FormVM {
    constructor(formType, search = false, dataManager, defaultData, pageSize = 10) {
        // Mapping시 결합도의 증가로 인해 mapper를 해제한 상태
        this.dataManager = dataManager ?? new Data();     // 데이터 관리용 클래스
        this.formType = formType;           // 타입별 버튼 부착용
        this.defaultData = defaultData;     // 초기데이터

        // 현재 데이터
        // - 잦은 참조가 필요하다. 
        //    // 그래서 ID를 ROW마다 참조해두고, 현재데이터에서 뽑아 쓰는 방식으로 구현
        //    // Index참조(단순 그리기)와 Hash ID참조가 필요하기 때매 Map으로 구현
        OTableState.update(defaultData ?? new Map());
        this._abstract_funcMapping();
        this._initMapping();
        this._handleSearchFormReset(defaultData); // Initialize the form with query data
        OPageState?.updateKey("CurrentPage", 1);
        if (search) {
            this._virtual_loadSearch();
        }
    }

    _abstract_funcMapping() {
        this.GetSearchForm; // TODO
        this._handleSearchFormReset; // TODO
        this.Api = ProductApi;

    }


    // 폼의 형태에 맞춰서 버튼 부착
    _initMapping() {
        this._initFormButtons();

        HeaderByModalType(this.formType);
        document.querySelectorAll('.onSearchButton').forEach(button => {
            button.addEventListener("click", async () => { await this._virtual_loadSearch(OPageState.getState().CurrentPage) });
        })
        document.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => { handleOpenWindow(event) });
        });
        document.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', async (event) => { await this._handlePagination(event.currentTarget.getAttribute('data-pagi')) });
        });
        document.querySelector('.deleteButton')?.addEventListener('click', async () => { console.log('삭제시작'); await this._handleDeleteSelected(); console.log('삭제완료'); });;

        this._init_listenMessage();
    }

    _initFormButtons() {
        const formButtons = document.getElementById('formButtons');
        if (!formButtons) return;

        switch (this.formType) {
            case 'get':
                new Button({
                    text: '적용', classes: ['primary-button'],
                    onClick: () => { this._handleInject() },
                    parent: formButtons
                });
                break;
            case 'post':
                new Button({
                    text: '저장', classes: ['primary-button'], onClick: (event) => {
                        this._handleSave(event);
                    }, parent: formButtons
                });
                break;
            case 'update':
                new Button({ text: '변경', classes: ['primary-button', 'onUpdateButton'], onClick: (event) => { this._handleUpdate(event) }, parent: formButtons });
                new Button({ text: '삭제', onClick: () => this._handleDelete(), parent: formButtons });
                break;
        }

        if (this.formType === 'post' || this.formType === 'update') {
            new Button({ text: '다시작성', onClick: () => this._handleSearchFormReset(this.defaultData), parent: formButtons });
        }

        // 폼데이터가 있으면 무조건 모달
        if (this.formType) {
            new Button({ text: '닫기', onClick: () => window.close(), parent: formButtons });
        }

    }

    // 이벤트 송신부. override사용 중
    _init_listenMessage() {
        window.addEventListener("message", async (event) => {
            // 공통해당 부분.
            if (event.data?.messageType === 'reSearchData') {
                await this._virtual_loadSearch();
            }
        });
    }

    // --------------------------------
    // 이벤트 정의부
    // --------------------------------
    // Delete
    async _handleDeleteSelected() {
        const selectedIds = CheckTableVM.getSelectedRowIds(document.getElementById('table-body'));
        if (selectedIds.length > 0) {
            for (let i = 0; i < selectedIds.length; i++) {

                await this.dataManager.deleteById(selectedIds[i]);
            }
            alert(`${selectedIds.length}개의 항목이 삭제되었습니다.`);
        } else {
            alert('선택된 항목이 없습니다.');
        }
        await this._virtual_loadSearch(); // Refresh the data
    }

    // POST
    async _handleSave(event) {
        event.preventDefault();

        const key = this._validateFormData(this.requiredKeys);
        if (key != true) {
            alert(`${key}를 채워주세요.`);
            return;
        }

        const dataObject = this.GetSearchForm();

        await this.dataManager.appendById(dataObject);
        alert('Data saved to LocalStorage');
        SendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // UPDATE
    async _handleUpdate(event) {
        event.preventDefault();

        const key = this._validateFormData(this.requiredKeys);
        if (key != true) {
            alert(`${key}를 채워주세요.`);
            return;
        }

        const dataObject = this.GetSearchForm();
        await this.dataManager.update(this.defaultData, dataObject);

        alert('Data updated in LocalStorage');
        SendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // DELETE
    _handleDelete = async () => {
        const queryData = useQuery();
        const queryId = queryData?.id;
        await this.dataManager.deleteById(queryId);
        alert(`${JSON.stringify(this.defaultData?.key)}가 삭제되었습니다.`)
        SendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // itemInjection
    _handleInject() {
        const targetTable = document.getElementById('table-body');
        if (CheckTableVM.getSelectedRowIds(targetTable).length === 0) {
            alert('체크된 항목이 없습니다.');
            return;
        }

        const ids = CheckTableVM.getSelectedRowIds(targetTable);
        const items = ids.map((id) => {
            console.log(OTableState.getState().get(id));
            return OTableState.getState().get(id)
        });
        console.log(items);
        alert();
        const message = {
            // TODO: 메세지 타입 분할
            messageType: 'set-items',
            items,
            ids: CheckTableVM.getSelectedRowIds(targetTable),
        }

        window.opener.postMessage(message, window.location.origin);
        window.close();
    }

    // FORM RESET
    // virtual
    // _handleSearchFormReset = (defaultData) => {
    //     if (defaultData) {
    //         const input1 = document.querySelector('input[name="id"]');
    //         input1.value = defaultData?.Key.PROD_CD;

    //         const input2 = document.querySelector('input[name="name"]');
    //         input2.value = defaultData?.PROD_NM;

    //         const input3 = document.querySelector('input[name="price"]');
    //         input3.value = defaultData?.PRICE;
    //     }
    // }

    // TABLE GET - 주로 마지막에 실행됨
    async _virtual_loadSearch() {
        console.log('페이지로드');

        const formObject = this.GetSearchForm();
        console.log("formObject", formObject);
        const res = await this.dataManager.search(formObject);
        try {
            console.log(res);
        }
        catch (e) {
            console.log(e);
        }

        const targetTable = document.getElementById('table-body');

        if (!targetTable) return;
        targetTable.innerHTML = ''; // 기존 데이터 삭제

        OPageState.update({
            CurrentPage: res?.CurrentPage,
            TotalPage: res?.TotalPage,
            onClickEvent: async (index) => {
                await this._handleIndexPagination(index.target.textContent);
            }
        })

        // OTableState.update(res?.Data);
        OTableState.update(arrayToMap(res?.Data));
    }


    // TABLE GET PAGINATION, 이벤트에서 얻은 값만큼 '더하는' 함수
    _handlePagination = async (addNum) => {
        let currentPage = OPageState?.getKey("CurrentPage");
        const direction = parseInt(addNum, 10);

        currentPage += direction;

        if (currentPage < 1) {
            currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }

        OPageState?.updateKey("CurrentPage", currentPage);
        await this._virtual_loadSearch();
        return;
    }

    // TABLE GET PAGINATION, 인덱스로 이동하는 함수
    _handleIndexPagination = async (index) => {
        let currentPage = OPageState?.getKey("CurrentPage");
        const direction = parseInt(index);
        currentPage = direction;
        if (direction < 1) {
            currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }

        OPageState?.updateKey("CurrentPage", currentPage);
        await this._virtual_loadSearch();
        return;
    }

    // Util
    _validateFormData(requiredKeys = []) {
        const formData = this.GetSearchForm();
        for (let key of requiredKeys) {
            if (formData[key] === undefined || formData[key] === null || formData[key] === '') {
                return key;
            }
        }
        return true;
    }



}

export function NewOpenWindowButton(targetHtml) {
    new Button({
        text: '신규',
        classes: ['primary-button', 'openWindow'],
        onClick: null,
        parent: formButtons,
        attributes: [
            { qualifiedName: 'data-href', value: targetHtml },
            { qualifiedName: 'data-query-modal-type', value: 'post' }
        ]
    });
}
