import { Http } from "../fetch/http.js";

export const ProductApi = {
    Search: SearcProduct,
    Insert: InsertProduct,
    Update: UpdateProduct,
    Delete: DeleteProduct,
};

const testDummy = {
    "ProductForm": {
        COM_CODE: "78600",
        PROD_CD: "88",
        PROD_NM: "99",
        PRICE: 1010
    },
    "OrderList": [
        PROD_CD, PROD_NM
    ],
    "CurrentPage": 1,
    "Count": 10
}

export async function SearcProduct({ queryParams = {} }) {
    try {
        const res = await Http.Post('/product-search', testDummy);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const INSERT_DUMMY = {
    Key: {
        "COM_CODE": "77",
        "PROD_CD": "88",
    },
    PROD_NM: "99",
    PRICE: 1010,
    WRITE_DT: "2024-08-28T12:34:56"
}

export async function InsertProduct() {
    try {
        const res = await Http.Post('/product-insert', INSERT_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const UPDATE_DUMMY = {
    Key: {
        COM_CODE: "77",
        PROD_CD: "88",
    },
    PROD_NM: "99",
    PRICE: 1010,
    WRITE_DT: "2024-08-28T12:34:56"
}

export async function UpdateProduct() {
    try {
        const res = await Http.Post('/product-update', UPDATE_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const DELETE_DUMMY = {
    "COM_CODE": 78600,
    "PROD_CD": "G743"
}

export async function DeleteProduct() {
    try {
        const res = await Http.Post('/product-delete', DELETE_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}