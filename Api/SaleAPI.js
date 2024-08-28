import { Http } from "../fetch/http.js"

export const SaleApi = {
    Search: SearchSale,
    Insert: InsertSale,
    Update: UpdateSale,
    Delete: DeleteSale,
}

const paramDummy = {
    "id": "",
    "start_date": "2014-10-10",
    "end_date": "",
    "description": "",
    "itemIds": []
}

const testDummy = {
    "SearchForm": {
        "COM_CODE": "78600",
        "START_IO_DATE": "20220110",
        "END_IO_DATE": "20251210",
        "IO_NO": 1,
        "PROD_LIST": [
            {
                "COM_CODE": 78600,
                "PROD_CD": "G743"
            }
        ],
        "REMARKS": "insert"
    },
    "OrderList": [
        "IO_DATE", "PROD_CD"
    ],
    "CurrentPage": 1,
    "Count": 10
}

export async function SearchSale({ queryParams = {} }) {
    try {
        const res = await Http.Post('/sale-search', testDummy);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const INSERT_DUMMY = {
    Key: {
        COM_CODE: "78600",
        IO_DATE: "20251210",
        IO_NO: "999"
    },
    QTY: 123,
    PROD_CD: "G743",
    PRICE: 12000,
    REMARKS: "insert"
}

export async function InsertSale() {
    try {
        const res = await Http.Post('/sale-insert', INSERT_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const UPDATE_DUMMY = {
    Key: {
        COM_CODE: "78600",
        IO_DATE: "20251210",
        IO_NO: "999"
    },
    QTY: 777,
    PROD_CD: "G743",
    PRICE: 77777,
    REMARKS: "7777"
}

export async function UpdateSale() {
    try {
        const res = await Http.Post('/sale-update', UPDATE_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}

const DELETE_DUMMY = {
    COM_CODE: "78600",
    IO_DATE: "20251210",
    IO_NO: "999"
}

export async function DeleteSale() {
    try {
        const res = await Http.Post('/sale-delete', DELETE_DUMMY);
        console.log(JSON.stringify(res));
    } catch {

    }
    return
}