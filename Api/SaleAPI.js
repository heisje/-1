import { Http } from "../fetch/http.js"

export const SaleApi = {
    Search: SearchSale,
    Get: GetSale,
    Insert: InsertSale,
    Update: UpdateSale,
    Delete: DeleteSale,
    DeleteList: DeleteSaleList,
}

const paramDummy = {
    "id": "",
    "start_date": "2014-10-10",
    "end_date": "",
    "description": "",
    "itemIds": []
}

const COM_CODE = 80000;

const testDummy = {
    "SearchForm": {
        "COM_CODE": COM_CODE,
        "START_IO_DATE": "20220110",
        "END_IO_DATE": "20251210",
        "IO_NO": 1,
        "PROD_LIST": [
            {
                "COM_CODE": COM_CODE,
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

// const data =
// {
//     "SearchForm": {
//         COM_CODE: COM_CODE,
//         PROD_CD: `${criteria?.id}`,
//         PROD_NM: `${criteria?.name}`,
//         PRICE: `${criteria?.price}`,
//         IS_USE: `${criteria?.is_use}`
//     },
//     "OrderList": [
//         "PROD_CD", "PROD_NM", "IS_USE"
//     ],
//     "CurrentPage": criteria.currentPage,
//     "Count": 10
// }

export async function SearchSale({ criteria }) {
    console.log("criteria", criteria);

    // start_date와 end_date를 YYYYMMDD 형식으로 변환
    const formattedStartDate = criteria?.start_date.replace(/-/g, '');
    const formattedEndDate = criteria?.end_date.replace(/-/g, '');

    const data = {
        "SearchForm": {
            "COM_CODE": COM_CODE,
            "START_IO_DATE": `${formattedStartDate}`,
            "END_IO_DATE": `${formattedEndDate}`,
            "IO_NO": `${criteria?.id}`,
            "PROD_LIST": [

                // {
                //     "COM_CODE": COM_CODE,
                //     "PROD_CD": "G743"
                // }
            ],
            "REMARKS": `${criteria?.description}`
        },
        "SortList": criteria?.Sort,
        "OrderList": [
            "IO_DATE", "PROD_CD"
        ],
        "CurrentPage": criteria?.CurrentPage ?? 1,
        "Count": 10
    }
    if (Array.isArray(criteria?.itemIds)) {
        // criteria.prod_list 배열을 순회하여 각 항목을 PROD_LIST에 매핑
        criteria.itemIds.forEach(prodCd => {
            data.SearchForm.PROD_LIST.push({
                "COM_CODE": COM_CODE,
                "PROD_CD": prodCd // 각 prodCd를 PROD_CD에 매핑
            });
        });
    }

    return await Http.Post('/sale-search', data);
}


export async function GetSale({ key }) {
    const parts = key.split('-'); // '-'을 기준으로 문자열을 나눕니다.

    const IO_DATE = parts[0]; // "20230801"
    const IO_NO = parts[1]; // "1"

    const data = {
        COM_CODE: COM_CODE,
        IO_DATE: IO_DATE,
        IO_NO: IO_NO
    }

    return await Http.Post('/sale-get', data);
}


const INSERT_DUMMY = {
    Key: {
        COM_CODE: COM_CODE,
        IO_DATE: "20251210",
        IO_NO: "999"
    },
    QTY: 123,
    PROD_CD: "G743",
    PRICE: 12000,
    REMARKS: "insert"
}

// {
//     "id": "",
//     "date": "2024-09-02",
//     "item": "3030",
//     "count": "3030",
//     "price": "3030",
//     "description": "3030",
//     "itemIds": [
//         "3030"
//     ]
// }

export async function InsertSale({ insertItem }) {
    console.log("insertItem", insertItem);
    const formattedDate = insertItem?.date.replace(/-/g, '');

    const data = {
        Key: {
            COM_CODE: COM_CODE,
            IO_DATE: `${formattedDate}`
        },
        QTY: insertItem?.count,
        PROD_CD: insertItem?.item,
        PRICE: insertItem?.price,
        REMARKS: insertItem?.description
    }

    return await Http.Post('/sale-insert', data);
}

const UPDATE_DUMMY = {
    Key: {
        COM_CODE: COM_CODE,
        IO_DATE: "20251210",
        IO_NO: "999"
    },
    QTY: 777,
    PROD_CD: "G743",
    PRICE: 77777,
    REMARKS: "7777"
}

export async function UpdateSale({ updateItem }) {
    const data = {
        Key: {
            COM_CODE: COM_CODE,
            IO_DATE: updateItem?.date.replace(/-/g, ''),
            IO_NO: updateItem?.IO_NO
        },
        QTY: updateItem?.count,
        PROD_CD: updateItem?.itemIds?.[0] ?? updateItem?.item,
        PRICE: updateItem?.price,
        REMARKS: updateItem?.description
    };
    return await Http.Post('/sale-update', data);
}

const DELETE_DUMMY = {
    COM_CODE: COM_CODE,
    IO_DATE: "20251210",
    IO_NO: "999"
}

export async function DeleteSale({ deleteKey }) {
    const parts = deleteKey.split('-'); // '-'을 기준으로 문자열을 나눕니다.

    const IO_DATE = parts[0]; // "20230801"
    const IO_NO = parts[1]; // "1"

    const data = {
        COM_CODE: COM_CODE,
        IO_DATE: IO_DATE,
        IO_NO: IO_NO
    }

    return await Http.Post('/sale-delete', data);
}

export async function DeleteSaleList({ Keys }) {

    const keys = Keys.map((item) => {
        const parts = item.split('-'); // '-'을 기준으로 문자열을 나눕니다.

        const IO_DATE = parts[0]; // "20230801"
        const IO_NO = parts[1]; // "1"
        return {
            COM_CODE: COM_CODE,
            IO_DATE: IO_DATE,
            IO_NO: IO_NO
        }
    })
    const data = [...keys];
    console.log("data", data);

    return await Http.Post('/sale-delete-list', data);
}