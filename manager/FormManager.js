import { queryObjectToURL } from "../util/query.js";
import { Modal } from "../modal/modal.js";
import { Button } from "../components/Button.js";

export class FormManager {

    constructor(formSelector, formType, dataManager, defaultData, pageSize = 10) {
        this.form = document.querySelector(formSelector);
        this.tbody = document.getElementById('table-body');
        this.dataManager = dataManager; //new Data(table);
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.formType = formType;
        this.defaultData = defaultData; //useQuery(); // Get query parameters

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
                    break;
            }
        }

        // console.log('initForm', this.form);
        if (this.form) {
            this.initForm();
        }
    }

    initForm() {
        this._initFormButtons();

        // TODO 제출 분리
        this.form.addEventListener('submit', () => { this._loadSearchData(1) });

        this.form.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => this._handleOpenWindow(event));
        });

        this.form.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', (event) => this._handlePagination(event));
        });

        this._handleReset(); // Initialize the form with query data

        try {
            this._loadSearchData(1);
        } catch {

        }
    }

    _initFormButtons() {
        const formButtons = document.getElementById('formButtons');
        if (!formButtons) return;

        if (this.formType === 'get') {
            new Button({ text: '적용', classes: ['primary-button', 'onSetButton'], onClick: null, parent: formButtons });
        }

        if (this.formType === 'post') {
            new Button({ text: '저장', classes: ['primary-button'], onClick: (event) => this._handleSave(event), parent: formButtons });
        }

        if (this.formType === 'update') {
            new Button({ text: '변경', classes: ['primary-button', 'onUpdateButton'], onClick: (event) => this._handleUpdate(event), parent: formButtons });
            new Button({ text: '삭제', classes: ['deleteButton'], onClick: () => this._handleDelete(), parent: formButtons });
        }

        if (this.formType === 'post' || this.formType === 'update') {
            new Button({ text: '다시작성', classes: ['resetButton'], onClick: () => this._handleReset(), parent: formButtons });
        }

        if (this.formType) {
            new Button({ text: '닫기', onClick: () => window.close(), parent: formButtons });
        }

    }

    // message를 통해, 적용을 누른 데이터를 부모로 넘김
    _setModalDataInParent() {

    }

    // window.open으로 연 popup으로 부터 message를 받아 데이터 새로고침
    _reloadParentData() {

    }

    _getFormData() {
        const formData = new FormData(this.form);
        const dataObject = {};

        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        return dataObject;
    }

    _addButton(parent, className, text, type = 'button') {
        const button = document.createElement('button');
        button.className = className;
        button.innerText = text;
        button.type = type;
        parent.appendChild(button);
    }

    _handleSave(event) {
        event.preventDefault();

        const dataObject = this._getFormData();

        this.dataManager.appendDataWithId(dataObject);
        alert('Data saved to LocalStorage');

        window.close();
    }

    _handleUpdate(event) {
        event.preventDefault();

        const dataObject = this._getFormData();

        this.dataManager.updateData(this.defaultData?.id, dataObject);
        alert('Data updated in LocalStorage');

        window.close();
    }

    _handleOpenWindow(event) {
        // console.log('_handleOpenWindow', event);

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

    _handleDelete() {
        this.dataManager.deleteDataById(this.defaultData?.id);
        alert(`${this.defaultData?.id}가 삭제되었습니다.`)
        window.close();
    }

    _handleReset() {
        this.form.querySelectorAll('input').forEach(input => {
            // console.log(input.name, this.defaultData[input.name])
            if (input.name && this.defaultData[input.name]) {
                input.value = this.defaultData[input.name];
            } else {
                input.value = '';
            }
        });
    }

    _handlePagination(event) {
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
        // console.log("페이지 이동", this.currentPage, totalPages);

        this._loadSearchData(this.currentPage);
        document.getElementById("currentPage").textContent = this.currentPage;
    }

    // 검색 조건에 따라 테이블 데이터 로드 함수
    _loadSearchData(pageNumber = 1) {
        const formObject = this._getFormData();

        const data = this.dataManager.paginationSearchData(formObject, pageNumber); // 검색된 데이터의 페이지네이션 결과 로드

        if (!this.tbody) return;
        this.tbody.innerHTML = ''; // 기존 데이터 삭제

        // 새 데이터 삽입
        // console.log('데이터', data);
        this._rowMaker(this.tbody, data);
    }

    _rowMaker(parent, data) {
        // 자식에서 구현
    }
}
