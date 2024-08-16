class OSaleFormUI {
    constructor() {
        this.parent = document.getElementById('header-input');
        this.validationElements = parent.querySelectorAll('.validation');
        this.parent.textContent
        this.validationMap = new Map();
        // 각 요소를 순회하면서 데이터 속성(data-key) 값에 따라 매핑
        validationElements.forEach(element => {
            const key = element.getAttribute('data-validation');
            this.validationMap[key] = element;
        });
    }

    update(object) {
        this.render({ data: object });
    }

    async render({ _, data }) {
        this.validationMap.forEach((element) => {
            const key = element.getAttribute('data-validation');
            if (key && data.hasOwnProperty(key)) {
                element.textContent = data[key];
                element.style.display = 'block';
            }
        })
    }
}