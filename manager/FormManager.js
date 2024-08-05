import { queryObjectToURL } from "../util/query.js";
import { Data } from "../data/data.js";
import { Modal } from "../modal/modal.js";

export class FormManager {
    constructor(formSelector, formType = 'get', table, defaultData) {
        this.form = document.querySelector(formSelector);
        this.tbody = document.getElementById('table-body');
        this.dataManager = new Data(table);
        this.currentPage = 1;
        this.formType = formType;
        this.defaultData = defaultData; //useQuery(); // Get query parameters

        const headerText = this.form.querySelector("#modalTypeText");
        if (headerText) {  // headerText가 null이 아닌지 확인
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



        console.log('initForm', this.form);
        if (this.form) {
            this.initForm();
        }
    }

    initForm() {
        this._initFormButtons();

        this.form.querySelectorAll(".onSaveButton").forEach(button => {
            button.addEventListener('click', (event) => this._handleSave(event));
        });
        this.form.querySelectorAll(".onUpdateButton").forEach(button => {
            button.addEventListener('click', (event) => this._handleUpdate(event));
        });

        this.form.querySelectorAll(".openWindow").forEach(button => {
            button.addEventListener("click", (event) => this._handleOpenWindow(event));
        });

        this.form.querySelectorAll(".closeButton").forEach(button => {
            button.addEventListener("click", () => window.close());
        });
        this.form.querySelectorAll(".resetButton").forEach(button => {
            button.addEventListener("click", () => this._handleReset());
        });
        this.form.querySelectorAll(".deleteButton").forEach(button => {
            button.addEventListener("click", () => this._handleDelete());
        });

        this.form.querySelectorAll("[data-pagi]").forEach(button => {
            button.addEventListener('click', (event) => this._handlePagination(event));
        });

        this._handleReset(); // Initialize the form with query data

        try {
            this._loadSearchData();
        } catch {

        }
    }

    _initFormButtons() {
        const formButtons = document.getElementById('formButtons');
        if (!formButtons) return;

        if (this.formType === 'post') {
            this._addButton(formButtons, 'primary-button onSaveButton', '저장');
        }

        // Add update and delete buttons if modal-type is update
        if (this.formType === 'update') {
            this._addButton(formButtons, 'primary-button onUpdateButton', '변경');
            this._addButton(formButtons, 'deleteButton', '삭제');
        }

        // Add reset and close buttons
        this._addButton(formButtons, 'resetButton', '다시작성');
        this._addButton(formButtons, 'closeButton', '닫기', 'button');
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

        this.dataManager.appendData(dataObject);
        alert('Data saved to LocalStorage');

        window.close();
    }

    _handleUpdate(event) {
        event.preventDefault();

        const dataObject = this._getFormData();

        this.dataManager.updateData(this.defaultData, dataObject);
        alert('Data updated in LocalStorage');

        window.close();
    }

    _getFormData() {
        const formData = new FormData(this.form);
        const dataObject = {};

        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        return dataObject;
    }

    _handleOpenWindow(event) {
        console.log('_handleOpenWindow', event);

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
        const url = queryObjectToURL(href, queryObject);
        console.log(href);
        new Modal(url, openType);
    }

    _handleDelete() {
        this.dataManager.removeExactData(this._getFormData());
        window.close();
    }

    _handleReset() {
        this.form.querySelectorAll('input').forEach(input => {
            console.log(input.name, this.defaultData[input.name])
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
        console.log("페이지 이동", this.currentPage, totalPages);

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
        this._rowMaker(this.tbody, data);
    }

    _rowMaker(parent, data) {
        data.items.forEach(item => {
            const row = document.createElement('tr');

            let cells = '';
            for (const key in this.defaultData) {
                if (this.defaultData.hasOwnProperty(key)) {
                    cells += `<td>${item[key] || ''}</td>`;
                }
            }

            row.innerHTML = `
                <td><input type="checkbox" name="row${item.itemCode}" /></td>
                ${cells}
                <td>
                    <button
                        class="openWindow"
                        data-href="itemForm.html"
                        data-query-modal-type="update"
                        data-query-itemCode=${item.itemCode}
                        data-query-itemName=${item.itemName}
                    >
                        수정
                    </button>
                </td>
            `;
            parent.appendChild(row);
        });
    }
}
