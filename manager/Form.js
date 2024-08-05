import { queryObjectToURL } from "../util/query.js";
import { Modal } from "../modal/modal.js";
import { Button } from "../components/Button.js";
import { Data } from "../data/data.js";
import { useQuery } from "../customhook/useQuery.js";

export class Form {

    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        this.form = document.querySelector(formSelector);
        this.tbody = document.getElementById('table-body');
        this.dataManager = dataManager;     // 데이터 관리용 클래스
        this.currentPage = 1;               // 현재 페이지
        this.pageSize = pageSize;           // 페이지네이션 최대 사이즈
        this.formType = formType;           // 타입별 버튼 부착용
        this.defaultData = defaultData;     // 초기데이터

        this._loadSearchData = this._loadSearchData.bind(this);
        this._getFormData = this._getFormData.bind(this);

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

        this.form.querySelectorAll('.onSearchButton').forEach(button => {
            button.addEventListener("click", () => this._loadSearchData(this.currentPage));
        })

        this.form.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => this._handleOpenWindow(event));
        });

        this.form.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', (event) => this._handlePagination(event));
        });

        const deleteButton = this.form.querySelector('.deleteButton');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => this._handleDeleteSelected());
        }

        this._handleReset(); // Initialize the form with query data

        window.addEventListener("message", (event) => {
            if (event.data?.messageType === 'set-items') {
                document.getElementById('item').value = event?.data?.ids;
            }
            if (event.data?.messageType === 'reSearchData') {
                this._loadSearchData(this.currentPage);
            }
        });

        try {
            this._loadSearchData(this.currentPage);

            const selectAllButton = this.form.querySelector('#selectAll');

            const query = useQuery();
            const selectCount = query?.['get-count'];
            if (selectCount >= 0) {
                selectAllButton.style.display = 'none';

                const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');

                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', (event) => {
                        const checkedCheckboxes = this.form.querySelectorAll('input[type="checkbox"]:checked');

                        if (checkedCheckboxes.length > selectCount) {
                            event.target.checked = false;

                            alert(`최대 ${selectCount}개 항목만 선택할 수 있습니다.`);
                        }
                    });
                });
            }

            if (selectAllButton) {
                selectAllButton.addEventListener("click", function (event) {
                    const checkboxes = this.form.querySelectorAll('tbody input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = event.target.checked;
                    });
                });
            }


        } catch {

        }
    }

    _handleDeleteSelected() {
        const selectedIds = this._getSelectedRowIds();
        if (selectedIds.length > 0) {
            selectedIds.forEach(id => this.dataManager.deleteDataById(id));
            alert(`${selectedIds.length}개의 항목이 삭제되었습니다.`);
            this._loadSearchData(this.currentPage); // Refresh the data
        } else {
            alert('선택된 항목이 없습니다.');
        }
    }

    _initFormButtons() {
        const formButtons = document.getElementById('formButtons');
        if (!formButtons) return;

        if (this.formType === 'get') {
            new Button({
                text: '적용', classes: ['primary-button'],
                onClick: () => {
                    if (this._getSelectedRowIds().length === 0) {
                        alert('체크된 항목이 없습니다.');
                        return;
                    }
                    const message = {
                        // TODO: 메세지 타입 분할
                        messageType: 'set-items',
                        ids: this._getSelectedRowIds(),
                    }
                    window.opener.postMessage(message, window.location.origin);
                    window.close();
                }, parent: formButtons
            });
        }

        if (this.formType === 'post') {
            new Button({
                text: '저장', classes: ['primary-button'], onClick: (event) => {
                    this._handleSave(event);
                }, parent: formButtons
            });
        }

        if (this.formType === 'update') {
            new Button({ text: '변경', classes: ['primary-button', 'onUpdateButton'], onClick: (event) => this._handleUpdate(event), parent: formButtons });
            new Button({ text: '삭제', onClick: () => this._handleDelete(), parent: formButtons });
        }

        if (this.formType === 'post' || this.formType === 'update') {
            new Button({ text: '다시작성', onClick: () => this._handleReset(), parent: formButtons });
        }

        if (this.formType) {
            new Button({ text: '닫기', onClick: () => window.close(), parent: formButtons });
        }

    }

    // GET
    _getFormData() {
        const formData = new FormData(this.form);
        const dataObject = {};

        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        return dataObject;
    }



    // POST
    _handleSave(event) {
        event.preventDefault();

        if (!this._validateFormData(this.requiredKeys)) {
            alert('필드를 채워주세요.');
            return;
        }

        const dataObject = this._getFormData();

        this.dataManager.appendDataWithId(dataObject);
        alert('Data saved to LocalStorage');
        this._sendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // UPDATE
    _handleUpdate(event) {
        event.preventDefault();

        if (!this._validateFormData(this.requiredKeys)) {
            alert('필드를 채워주세요.');
            return;
        }

        const dataObject = this._getFormData();
        dataObject.id = this.defaultData?.id;
        this.dataManager.updateData(this.defaultData?.id, dataObject);

        alert('Data updated in LocalStorage');
        this._sendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // DELETE
    _handleDelete = () => {
        this.dataManager.deleteDataById(this.defaultData?.id);
        alert(`${this.defaultData?.id}가 삭제되었습니다.`)
        this._sendMessage({ messageType: 'reSearchData' });
        window.close();
    }

    // OPEN NEW MODAL
    _handleOpenWindow(event) {
        const href = event.currentTarget.getAttribute("data-href");
        const openType = event.currentTarget.getAttribute("data-query-modal-type");

        // data-query-..로 정의해논 데이터를 전부 쿼리로 생성
        const queryObject = {};

        Array.from(event.currentTarget.attributes).forEach(attr => {
            if (attr.name.startsWith('data-query-')) {
                const key = attr.name.replace('data-query-', '');
                const value = attr.value;
                queryObject[key] = value;
            }
        });

        const row = event.currentTarget.closest('tr');
        if (row) {
            const id = row.getAttribute('id');
            queryObject['id'] = id;
        }

        const url = queryObjectToURL(href, queryObject);

        new Modal(url, openType);
    }

    // FORM RESET
    _handleReset = () => {
        this.form.querySelectorAll('input').forEach(input => {
            if (input.name && this.defaultData[input.name]) {
                input.value = this.defaultData[input.name];
            } else {
                input.value = '';
            }
        });
    }

    // TABLE GET 
    _loadSearchData(pageNumber = 1) {
        const formObject = this._getFormData();

        const data = this.dataManager.paginationSearchData(formObject, pageNumber); // 검색된 데이터의 페이지네이션 결과 로드

        if (!this.tbody) return;
        this.tbody.innerHTML = ''; // 기존 데이터 삭제

        this._rowMaker(this.tbody, data);
    }

    // TABLE GET PAGINATION
    _handlePagination = (event) => {
        const direction = parseInt(event.currentTarget.getAttribute('data-pagi'), 10);
        const totalPages = Math.ceil(this.dataManager.loadData().length / this.dataManager.pageSize);

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
    }



    // CREATE ROW 자식컴포넌트에서 구현
    _rowMaker(parent, data) {
        // 자식에서 구현
    }

    // TABLE GET ID
    _getSelectedRowIds() {
        const selectedIds = [];
        const checkboxes = document.querySelectorAll('#table-body input[type="checkbox"]:checked');

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
                return false;
            }
        }
        return true;
    }
}
