import { ProductApi } from "../Api/ProductAPI.js";
import { SaleApi } from "../Api/SaleAPI.js";
import { OPageState, OSortState } from "../ObservingUI/OState.js";

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
    async update(defaultData, updateItem) {
        const res = await this.Api.Update({ updateItem });
    }

    // DELETE
    async deleteById(id) {
        await this.Api.Delete({ deleteKey: id });
    }

    async deleteList(Keys) {
        await this.Api.Delete({ Keys });
    }

    async searchProduct(criteria) {
        criteria.CurrentPage = OPageState?.getState()?.CurrentPage ?? 1;

        const response = await this.Api.Search({ criteria });

        return response;
    }

    async searchSalesData(criteria) {
        criteria.CurrentPage = OPageState?.getState()?.CurrentPage ?? 1;
        const response = await this.Api.Search({ criteria });
        return response;
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
