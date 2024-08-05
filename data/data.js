export class Data {

    constructor(localStorageKey, pageSize = 10) {
        this.localStorageKey = localStorageKey;
        this.pageSize = pageSize;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) | 0x40;
            const v = c === 'x' ? r : (r & 0x3f) | 0x80;
            return v.toString(16);
        });
    }

    // get
    loadData() {
        const jsonData = localStorage.getItem(this.localStorageKey);
        return jsonData ? JSON.parse(jsonData) : [];
    }

    getDataById(id) {
        const existingData = this.loadData();
        const item = existingData.find(item => item.id === id);
        if (!item) {
            throw new Error("Item not found");
        }
        return item;
    }

    // post
    appendData(newData) {
        const existingData = this.loadData();
        existingData.push(newData);
        this.saveAllData(existingData);
    }

    appendDataWithId(item) {
        if (!item.id) {
            item.id = this.generateUUID();
        }

        const existingData = this.loadData();
        existingData.push(item);
        this.saveAllData(existingData);
    }

    saveAllData(existingData) {
        const jsonData = JSON.stringify(existingData);
        localStorage.setItem(this.localStorageKey, jsonData);
    }

    // update
    updateData(id, updatedData) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const index = existingData.findIndex(item => item.id === id);
        if (index !== -1) {
            console.log(existingData, index);
            existingData[index] = { ...updatedData };
            this.saveAllData(existingData);
        } else {
            throw new Error("Item not found");
        }
    }

    // delete
    deleteDataById(id) {
        let existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        existingData = existingData.filter(item => item.id !== id);
        this.saveAllData(existingData);
    }

    deleteDataAll() {
        localStorage.removeItem(this.localStorageKey);
    }


    // GET
    paginationLoadData(currentPage) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const totalPage = Math.ceil(existingData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        return {
            currentPage: currentPage,
            totalPage: totalPage,
            items: existingData.slice(startIndex, endIndex)
        };
    }

    searchData(criteria) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }
        const { id, name } = criteria;

        const result = existingData.filter(data => {
            const matchesId = !id || data.id.includes(id);
            const matchesName = !name || data.name.includes(name);

            return matchesId && matchesName;
        });

        return result;
    }

    paginationSearchData(query, currentPage = 1) {
        const searchData = this.searchData(query);

        const totalPage = Math.ceil(searchData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        const result = {
            currentPage: currentPage,
            totalPage: totalPage,
            items: searchData.slice(startIndex, endIndex)
        };
        return result;
    }

    searchSalesData(criteria) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const { start_date, end_date, item, description } = criteria;

        const result = existingData.filter(data => {
            const itemArray = data.item.split(',').map(itemString => {
                const [count, price] = itemString.split(':');
                return { date: data.date, item: data.item, count, price, description: data.description, id: data.id };
            });

            return itemArray.some(itemData => {
                const matchesStartDate = !start_date || new Date(itemData.date) >= new Date(start_date);
                const matchesEndDate = !end_date || new Date(itemData.date) <= new Date(end_date);
                const matchesItem = !item || itemData.item.includes(item);
                const matchesDescription = !description || itemData.description.includes(description);

                return matchesStartDate && matchesEndDate && matchesItem && matchesDescription;
            });
        });

        return result;
    }



    paginationSalesSearchData(query, currentPage = 1) {
        const searchData = this.searchSalesData(query);

        const totalPage = Math.ceil(searchData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        const result = {
            currentPage: currentPage,
            totalPage: totalPage,
            items: searchData.slice(startIndex, endIndex)
        };
        return result;
    }


    getDataByIndex(index) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        if (index < 0 || index >= existingData.length) {
            throw new Error("Index out of bounds");
        }

        return existingData[index];
    }

    // 현재 페이지와 인덱스를 입력받아 해당 데이터를 반환하는 함수
    getDataByPageAndIndex(currentPage, index) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const totalPage = Math.ceil(existingData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = existingData.slice(startIndex, endIndex);

        if (index < 0 || index >= pageData.length) {
            throw new Error("Index out of bounds for current page");
        }

        return pageData[index];
    }
}
