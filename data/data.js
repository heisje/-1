export class Data {

    constructor(localStorageKey, pageSize = 10) {
        this.localStorageKey = localStorageKey;
        this.pageSize = pageSize;
    }

    // 임시 ID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f) | 0x40;
            const v = c === 'x' ? r : (r & 0x3f) | 0x80;
            return v.toString(16);
        });
    }

    // GET
    async getAll() {
        const jsonData = localStorage.getItem(this.localStorageKey);
        return jsonData ? JSON.parse(jsonData) : [];
    }

    // GET
    async getById(id) {
        const existingData = await this.getAll();
        const item = existingData.find(item => item.id === id);
        if (!item) {
            throw new Error("Item not found");
        }
        return item;
    }

    // POST
    async appendById(item) {
        if (!item.id || item.id === '') {
            item.id = this.generateUUID();
        }

        const existingData = await this.getAll();
        existingData.push(item);
        await this.saveAll(existingData);
    }

    // UTIL POST
    async saveAll(existingData) {
        const jsonData = JSON.stringify(existingData);
        localStorage.setItem(this.localStorageKey, jsonData);
    }

    // UPDATE
    async update(id, updatedData) {
        const existingData = await this.getAll();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const index = existingData.findIndex(item => item.id === id);
        if (index !== -1) {
            // 아이디가 문제야 문제
            if (!updatedData.id) {
                updatedData.id = id;
            }
            existingData[index] = { ...updatedData };
            await this.saveAll(existingData);
        } else {
            throw new Error("Item not found");
        }
    }

    // DELETE
    async deleteById(id) {
        let existingData = await this.getAll();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        existingData = existingData.filter(item => item.id !== id);
        await this.saveAll(existingData);
    }

    async search(criteria) {
        const existingData = await this.getAll();
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

    pagintionedData(totalData, currentPage = 1) {
        const totalPage = Math.ceil(totalData.length / this.pageSize);
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPage) currentPage = totalPage;

        const startIndex = (currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        const result = {
            currentPage: currentPage,
            totalPage: totalPage,
            items: totalData.slice(startIndex, endIndex)
        };
        return result;
    }

    async searchSalesData(criteria) {
        const existingData = await this.getAll();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const { start_date, end_date, itemIds, description } = criteria;
        const result = existingData.filter(data => {
            const itemArray = data.item.split(',').map(itemString => {
                const [count, price] = itemString.split(':');
                return { date: data.date, item: data.item, count, price, description: data.description, id: data.id };
            });

            return itemArray.some(itemData => {
                const matchesStartDate = !start_date || new Date(itemData.date) >= new Date(start_date);
                const matchesEndDate = !end_date || new Date(itemData.date) <= new Date(end_date);
                const matchesItem = !itemIds || itemData.item.includes(itemIds);
                const matchesDescription = !description || itemData.description.includes(description);

                return matchesStartDate && matchesEndDate && matchesItem && matchesDescription;
            });

        });

        return result;
    }
}
