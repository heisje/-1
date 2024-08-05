export class Data {
    constructor(localStorageKey, pageSize = 10) {
        this.localStorageKey = localStorageKey;
        this.pageSize = pageSize;
    }

    saveData(data) {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(this.localStorageKey, jsonData);
    }

    updateData(existingDataKey, updatedData) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        console.log(existingDataKey, updatedData);
        const index = existingData.findIndex(item => item.item_code === existingDataKey.item_code);
        if (index !== -1) {
            existingData[index] = updatedData;
            this.saveData(existingData);
        } else {
            throw new Error("Item not found");
        }
    }

    loadData() {
        const jsonData = localStorage.getItem(this.localStorageKey);
        return jsonData ? JSON.parse(jsonData) : [];
    }

    clearData() {
        localStorage.removeItem(this.localStorageKey);
    }

    appendData(newData) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }
        existingData.push(newData);
        this.saveData(existingData);
    }

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

    searchData(query) {
        const existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        return existingData.filter(item => {
            return Object.keys(query).every(key => {
                return !query[key] || item[key].includes(query[key]);
            });
        });
    }

    paginationSearchData(query, currentPage) {
        const searchData = this.searchData(query);

        const totalPage = Math.ceil(searchData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        return {
            currentPage: currentPage,
            totalPage: totalPage,
            items: searchData.slice(startIndex, endIndex)
        };
    }

    // 완전히 동일한 객체를 제거하는 메서드
    removeExactData(itemToRemove) {
        let existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        existingData = existingData.filter(existingItem =>
            JSON.stringify(existingItem) !== JSON.stringify(itemToRemove)
        );
        this.saveData(existingData);
    }

    // 일치한 키값 제거
    removeDataByKey(key, valuesToRemove) {
        let existingData = this.loadData();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        existingData = existingData.filter(item => !valuesToRemove.includes(item[key]));
        this.saveData(existingData);
    }


}
