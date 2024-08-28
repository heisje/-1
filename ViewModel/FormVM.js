import { Button } from "../components/common/Button.js";
import { Data } from "../data/data.js";
import { arrayToMap } from "../Utils/arrayToMap.js";
import { handleOpenWindow } from "../modal/handleOpenWindow.js";
import { HeaderByModalType } from "../components/HeaderText.js";
import { CheckTableVM } from "./CheckTableVM.js";
import { OPageState, OTableState } from "../ObservingUI/OState.js";
import { SendMessage } from "../Events/Message.js";


// 행위대리자
export class FormVM {
    constructor(formType, dataManager, defaultData, pageSize = 10) {
        // Mapping시 결합도의 증가로 인해 mapper를 해제한 상태
        this.dataManager = dataManager ?? new Data();     // 데이터 관리용 클래스
        this.formType = formType;           // 타입별 버튼 부착용
        this.defaultData = defaultData;     // 초기데이터

        // 현재 데이터
        // - 잦은 참조가 필요하다. 
        //    // 그래서 ID를 ROW마다 참조해두고, 현재데이터에서 뽑아 쓰는 방식으로 구현
        //    // Index참조(단순 그리기)와 Hash ID참조가 필요하기 때매 Map으로 구현
        // 
        OTableState.update(defaultData ?? new Map());

        this._initMapping();
        this._virtual_handleSearchFormReset(); // Initialize the form with query data

        this._pagiManager();
    }

    _pagiManager() {
        this.currentPage = 1;               // 현재 페이지
        this._virtual_loadSearch(this.currentPage);

    }


    // 폼의 형태에 맞춰서 버튼 부착
    _initMapping() {
        this._initFormButtons();

        HeaderByModalType(this.formType);
        document.querySelectorAll('.onSearchButton').forEach(button => {
            button.addEventListener("click", async () => { await this._virtual_loadSearch(OPageState.getState().currentPage) });
        })
        document.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => { handleOpenWindow(event) });
        });
        document.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', async (event) => { await this._handlePagination(event.currentTarget.getAttribute('data-pagi')) });
        });
        document.querySelector('.deleteButton')?.addEventListener('click', async () => { console.log('삭제시작'); await this._handleDeleteSelected(); console.log('삭제완료'); });;

        this._init_virtual_listenMessage();
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
            new Button({ text: '다시작성', onClick: () => this._virtual_handleSearchFormReset(), parent: formButtons });
        }

        // 폼데이터가 있으면 무조건 모달
        if (this.formType) {
            new Button({ text: '닫기', onClick: () => window.close(), parent: formButtons });
        }

    }

    // 이벤트 송신부. override사용 중
    _init_virtual_listenMessage() {
        window.addEventListener("message", async (event) => {
            // 공통해당 부분.
            if (event.data?.messageType === 'reSearchData') {
                await this._virtual_loadSearch(this.currentPage);
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
        await this._virtual_loadSearch(this.currentPage); // Refresh the data
    }

    // POST
    async _handleSave(event) {
        event.preventDefault();

        const key = this._validateFormData(this.requiredKeys);
        if (key != true) {
            alert(`${key}를 채워주세요.`);
            return;
        }

        const dataObject = this._virtual_getSearchForm();

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

        const dataObject = this._virtual_getSearchForm();
        if (!dataObject.id) {
            this.defaultData?.id;
        }
        await this.dataManager.update(this.defaultData?.id, dataObject);

        alert('Data updated in LocalStorage');
        SendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // DELETE
    _handleDelete = async () => {
        await this.dataManager.deleteById(this.defaultData?.id);
        alert(`${this.defaultData?.id}가 삭제되었습니다.`)
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
    _virtual_handleSearchFormReset = () => {
        document.getElementById('dataForm').querySelectorAll('input').forEach(input => {
            if (input.name && this.defaultData[input.name]) {
                input.value = this.defaultData[input.name];
            } else {
                input.value = '';
            }
            input?.item // Doing
        });
    }

    // TABLE GET - 주로 마지막에 실행됨
    async _virtual_loadSearch(pageNumber = 1) {
        console.log('페이지로드');
        const formObject = this._virtual_getSearchForm();
        const data = await this.dataManager.search(formObject);
        const pagintionedData = this.dataManager.pagintionedData(data, pageNumber);
        const targetTable = document.getElementById('table-body');

        if (!targetTable) return;
        targetTable.innerHTML = ''; // 기존 데이터 삭제

        OPageState.update({
            currentPage: pagintionedData?.currentPage,
            totalPages: pagintionedData?.totalPage,
            onClickEvent: async (index) => {
                await this._handleIndexPagination(index.target.textContent);
            }
        })

        OTableState.update(arrayToMap(pagintionedData?.items));
    }


    // TABLE GET PAGINATION, 이벤트에서 얻은 값만큼 '더하는' 함수
    _handlePagination = async (addNum) => {
        let currentPage = this.currentPage;
        const direction = parseInt(addNum, 10);
        const loadedData = await this.dataManager.getAll();
        const totalPages = Math.ceil(loadedData.length / this.dataManager.pageSize);

        if (currentPage + direction < 1) {
            currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }
        else if (currentPage + direction <= totalPages) {
            currentPage += direction;
        } else if (totalPages < currentPage + direction) {
            currentPage = totalPages
        }

        this.currentPage = currentPage;
        this._virtual_loadSearch(this.currentPage);
        return;
    }

    // TABLE GET PAGINATION, 인덱스로 이동하는 함수
    _handleIndexPagination = async (index) => {
        let currentPage = this.currentPage;
        const direction = parseInt(index);
        const loadedData = await this.dataManager.getAll();
        const totalPages = Math.ceil(loadedData.length / this.dataManager.pageSize);

        if (direction < 1) {
            currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }
        else if (direction <= totalPages) {
            currentPage = direction;
        } else if (totalPages < direction) {
            currentPage = totalPages
        }

        this.currentPage = currentPage;
        await this._virtual_loadSearch(this.currentPage);
        return;
    }

    // Util
    _validateFormData(requiredKeys = []) {
        const formData = this._virtual_getSearchForm();
        for (let key of requiredKeys) {
            if (formData[key] === undefined || formData[key] === null || formData[key] === '') {
                return key;
            }
        }
        return true;
    }


    _virtual_getSearchForm() {
        const formData = new FormData(document.getElementById('dataForm'));
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });
        return dataObject;
    }
}
