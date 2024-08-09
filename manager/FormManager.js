import { Button } from "../components/Button.js";
import { Data } from "../data/data.js";
import { Pagination } from "../components/Pagination.js";
import { arrayToMap } from "../util/arrayToMap.js";
import { handleOpenWindow } from "../modal/handleOpenWindow.js";

export class FormManager {

    constructor(formSelector, formType, dataManager = new Data(), defaultData, pageSize = 10) {
        this.form = document.querySelector(formSelector);
        this.tbody = document.getElementById('table-body');
        this.dataManager = dataManager;     // 데이터 관리용 클래스
        this.currentPage = 1;               // 현재 페이지
        this.pageSize = pageSize;           // 페이지네이션 최대 사이즈
        this.formType = formType;           // 타입별 버튼 부착용
        this.defaultData = defaultData;     // 초기데이터

        // 현재 데이터
        // 현재 데이터를 저장한 이유: 잦은 참조가 필요하다. 
        // html에 data-로 데이터를 저장할 수는 있지만, 잦은 DOM API호출은 성능상 이점이 없다 생각된다. 
        //    // 그래서 ID를 ROW마다 참조해두고, 현재데이터에서 뽑아 쓰는 방식으로 구현
        //    // Index참조(단순 그리기)와 Hash ID참조가 필요하기 때매 Map으로 구현
        // TODO: 데이터 참조 시작점을 이 객체로 변경
        this.currentMapData = defaultData;     // 현재 데이터

        const headerText = this.form.querySelector("#modalTypeText");

        if (headerText) {  // headerText가 null이 아닌지 확인
            // TODO: StaticText 객체화
            switch (this.formType) {
                case 'get':
                    headerText.textContent = '조회';
                    break;
                case 'post':
                    headerText.textContent = '등록';
                    break;
                case 'update':
                    headerText.textContent = '수정';
                    const date = this.form.querySelector("#date");
                    if (date) {  // headerText가 null이 아닌지 확인
                        date.setAttribute('readonly', true);
                        date.addEventListener('keydown', (event) => {
                            event.preventDefault();
                        });
                    }
                    break;
            }
        }
        if (this.form) {
            this._initForm();
        }
    }

    // 폼의 형태에 맞춰서 버튼 부착
    _initForm() {
        this._initFormButtons();

        document.querySelectorAll('.onSearchButton').forEach(button => {
            button.addEventListener("click", async () => { await this._loadSearchData(this.currentPage) });
        })

        document.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => { handleOpenWindow(event) });
        });

        document.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', async (event) => { await this._handlePagination(event) });
        });

        const deleteButton = document.querySelector('.deleteButton');
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => { console.log('삭제시작'); await this._handleDeleteSelected(); console.log('삭제완료'); });
        }

        // 
        this._handleSearchFormReset(); // Initialize the form with query data

        this._virtual_listenMessage();

        try {
            this._loadSearchData(this.currentPage);

        } catch (e) {
            console.log(e);
        }
    }

    // 이벤트 송신부. override사용중
    _virtual_listenMessage() {
        window.addEventListener("message", async (event) => {
            // 공통해당 부분.
            if (event.data?.messageType === 'reSearchData') {
                await this._loadSearchData(this.currentPage);
            }
        });
    }

    async _handleDeleteSelected() {
        console.log('삭제시작');
        const selectedIds = this._getSelectedRowIds();
        if (selectedIds.length > 0) {
            await Promise.all(selectedIds.map(id => this.dataManager.deleteDataById(id)));
            alert(`${selectedIds.length}개의 항목이 삭제되었습니다.`);
        } else {
            alert('선택된 항목이 없습니다.');
        }
        console.log('결과:', this.currentPage);
        console.log('결과:', this.currentPage);
        await this._loadSearchData(this.currentPage); // Refresh the data
        console.log(await this.dataManager.searchData());
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
            new Button({ text: '다시작성', onClick: () => this._handleSearchFormReset(), parent: formButtons });
        }

        // 폼데이터가 있으면 무조건 모달
        if (this.formType) {
            new Button({ text: '닫기', onClick: () => window.close(), parent: formButtons });
        }

    }

    // GET
    _getFormData() {
        // TODO : button의 data-id를 다 가져와야함 
        const formData = new FormData(this.form);
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        return dataObject;
    }

    // POST
    async _handleSave(event) {
        event.preventDefault();

        const key = this._validateFormData(this.requiredKeys);
        if (key != true) {
            alert(`${key}를 채워주세요.`);
            return;
        }

        const dataObject = this._getFormData();

        await this.dataManager.appendDataWithId(dataObject);
        alert('Data saved to LocalStorage');
        this._sendMessage({ messageType: 'reSearchData' });
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

        const dataObject = this._getFormData();
        if (!dataObject.id) {
            this.defaultData?.id;
        }
        await this.dataManager.updateData(this.defaultData?.id, dataObject);

        alert('Data updated in LocalStorage');
        this._sendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // DELETE
    _handleDelete = async () => {
        await this.dataManager.deleteDataById(this.defaultData?.id);
        alert(`${this.defaultData?.id}가 삭제되었습니다.`)
        this._sendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    _handleInject() {
        if (this._getSelectedRowIds().length === 0) {
            alert('체크된 항목이 없습니다.');
            return;
        }
        const ids = this._getSelectedRowIds();
        const items = ids.map((id) => this.currentMapData.get(id));
        const message = {
            // TODO: 메세지 타입 분할
            messageType: 'set-items',
            items,
            ids: this._getSelectedRowIds(),
        }

        window.opener.postMessage(message, window.location.origin);
        window.close();

    }


    // FORM RESET
    // virtual
    _handleSearchFormReset = () => {
        this.form.querySelectorAll('input').forEach(input => {
            if (input.name && this.defaultData[input.name]) {
                input.value = this.defaultData[input.name];
            } else {
                input.value = '';
            }
            input?.item // Doing
        });
    }

    // TABLE GET - 주로 마지막에 실행됨
    async _loadSearchData(pageNumber = 1) {
        const formObject = this._getFormData();
        const data = await this.dataManager.searchData(formObject);
        const pagintionedData = this.dataManager.pagintionedData(data, pageNumber);

        if (!this.tbody) return;
        this.tbody.innerHTML = ''; // 기존 데이터 삭제

        Pagination(pagintionedData?.currentPage, pagintionedData?.totalPage,
            async (index) => {
                await this._handleIndexPagination(index.target.textContent);
            }
        );

        this.currentMapData = arrayToMap(pagintionedData?.items);
        this._rowMaker(this.tbody, pagintionedData);
    }

    // 상태변경 = Save Current Rows Data,  using MAP
    // TODO : DATA 클래스로 넘기기
    _updateCurrentMapData(data = []) {
        const currentDataObjcet = new Map();
        data.forEach((item) => {
            currentDataObjcet.set(item?.id, { ...item });
        })
        return currentDataObjcet;
    }


    // TABLE GET PAGINATION
    _handlePagination = async (event) => {
        const direction = parseInt(event.currentTarget.getAttribute('data-pagi'), 10);
        const loadedData = await this.dataManager.loadData();
        const totalPages = Math.ceil(loadedData.length / this.dataManager.pageSize);

        if (this.currentPage + direction < 1) {
            this.currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }
        else if (this.currentPage + direction <= totalPages) {
            this.currentPage += direction;
        } else if (totalPages < this.currentPage + direction) {
            this.currentPage = totalPages
        }

        this._loadSearchData(this.currentPage);
        document.getElementById("currentPage").textContent = this.currentPage;
        return;
    }

    // TABLE GET PAGINATION
    _handleIndexPagination = async (index) => {
        const direction = parseInt(index);
        const loadedData = await this.dataManager.loadData();
        const totalPages = Math.ceil(loadedData.length / this.dataManager.pageSize);

        if (direction < 1) {
            this.currentPage = 1; // 페이지 번호가 1보다 작아지지 않도록 방지
        }
        else if (direction <= totalPages) {
            this.currentPage = direction;
        } else if (totalPages < direction) {
            this.currentPage = totalPages
        }

        await this._loadSearchData(this.currentPage);
        document.getElementById("currentPage").textContent = this.currentPage;
        return;
    }



    // CREATE ROW 자식컴포넌트에서 구현
    _rowMaker(parent, data) {
        // 자식에서 구현
    }

    // TABLE GET ID
    _getSelectedRowIds() {
        const selectedIds = [];
        const checkboxes = this.tbody.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (row && row.id) {
                selectedIds.push(row.id);
            }
        });

        return selectedIds;
    }

    // MESSAGE
    _sendMessage(message = { messageType: 'reSearchData' }) {
        window.opener.postMessage(message, window.location.origin);
    }

    // Util
    _validateFormData(requiredKeys = []) {
        const formData = this._getFormData();
        for (let key of requiredKeys) {
            if (formData[key] === undefined || formData[key] === null || formData[key] === '') {
                return key;
            }
        }
        return true;
    }
}
