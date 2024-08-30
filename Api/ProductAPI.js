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
        "PROD_CD", "PROD_NM"
    ],
    "CurrentPage": 1,
    "Count": 10
}

export async function SearcProduct({ criteria }) {
    console.log(criteria);
    const data =
    {
        "SearchForm": {
            COM_CODE: "77",
            PROD_CD: `${criteria?.id}`,
            PROD_NM: `${criteria?.name}`,
            PRICE: `${criteria?.price}`
        },
        "OrderList": [
            "PROD_CD", "PROD_NM"
        ],
        "CurrentPage": criteria.currentPage,
        "Count": 10
    }

    try {
        const res = await Http.Post('/product-search', data);
        console.log("받은 결과", JSON.stringify(res));
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

export async function InsertProduct({ insertItem }) {
    const data = {
        Key: {
            "COM_CODE": "77",
            "PROD_CD": `${insertItem?.id}`,
        },
        PROD_NM: `${insertItem?.name}`,
        PRICE: insertItem?.price,
        WRITE_DT: new Date().toISOString(),
    }

    try {
        if (!data) {
            throw new Error();
        }
        const res = await Http.Post('/product-insert', data);
        console.log(JSON.stringify(res));
    } catch (e) {
        alert("InsertProduct 실패");
        console.error(e);
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

export async function UpdateProduct({ updateItem }) {
    console.log("UpdateProduct", updateItem);
    const data = {
        Key: {
            "COM_CODE": "77",
            "PROD_CD": `${updateItem?.id}`,
        },
        PROD_NM: `${updateItem?.name}`,
        PRICE: updateItem?.price,
        WRITE_DT: new Date().toISOString(),
    }

    try {
        const res = await Http.Post('/product-update', data);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const DELETE_DUMMY = {
    "COM_CODE": 78600,
    "PROD_CD": "G743"
}

export async function DeleteProduct({ deleteKey }) {
    console.log("DeleteProduct", deleteKey);
    const data = {
        "COM_CODE": "77",
        "PROD_CD": `${deleteKey?.id}`,
    }

    try {
        const res = await Http.Post('/product-delete', data);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}