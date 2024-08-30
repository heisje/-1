import { ProductApi } from "../Api/ProductAPI.js";
import { SaleApi } from "../Api/SaleAPI.js";
import { OPageState } from "../ObservingUI/OState.js";

// 연동 관리
export class Data {

    constructor(Entity, pageSize = 10) {
        this.Entity = Entity;
        this.pageSize = pageSize;
        this.Api = ProductApi;
        switch (Entity) {
            case "item":
                this.search = this.searchProduct;
                this.Api = ProductApi;
                break;
            case "sales":
                this.search = this.searchSalesData;
                this.Api = SaleApi;
                break;
        }
    }

    // GET
    async getById(id) {
        const existingData = await this.getAll();
        const item = existingData.find(item => item.id === id);
        if (!item) {
            return {
                "id": "1",
                "name": "1",
                "date": "1111-11-11",
                "item": "1",
                "count": "1",
                "price": "1",
                "description": "1",
                "itemIds": [
                    "1"
                ]
            };
        }
        return item;
    }

    // POST
    async appendById(insertItem) {
        await this.Api.Insert({ insertItem });

        // 기존코드
        if (!insertItem.id || insertItem.id === '') {
            insertItem.id = this.generateUUID();
        }
        const existingData = await this.getAll();
        existingData.push(insertItem);
        await this.saveAll(existingData);
    }



    // UPDATE
    async update(id, updateItem) {
        await this.Api.Update({ updateItem });

        // 기존 코드
        const existingData = await this.getAll();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        const index = existingData.findIndex(item => item.id === id);
        if (index !== -1) {
            // 아이디가 문제야 문제
            if (!updateItem.id) {
                updateItem.id = id;
            }
            existingData[index] = { ...updateItem };
            await this.saveAll(existingData);
        } else {
            throw new Error("Item not found");
        }
    }

    // DELETE
    async deleteById(deleteKey) {
        await this.Api.Delete({ deleteKey });

        // 기존 코드
        let existingData = await this.getAll();
        if (!Array.isArray(existingData)) {
            throw new Error("Existing data is not an array");
        }

        existingData = existingData.filter(item => item.id !== deleteKey);
        await this.saveAll(existingData);
    }

    async searchProduct(criteria) {
        criteria.currentPage = OPageState?.getState()?.currentPage ?? 1;
        await this.Api.Search({ criteria });

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

    // -------------------------------
    // JS만을 위한 함수
    // --------------------------------
    // UTIL POST
    async saveAll(existingData) {
        const jsonData = JSON.stringify(existingData);
        localStorage.setItem(this.Entity, jsonData);
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
        const jsonData = localStorage.getItem(this.Entity);
        return jsonData ? JSON.parse(jsonData) : [];
    }
}
