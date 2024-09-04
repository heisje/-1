import { Http } from "../fetch/http.js";

export const ProductApi = {
    Search: SearchProduct,
    Get: GetProduct,
    Insert: InsertProduct,
    Update: UpdateProduct,
    Delete: DeleteProduct,
    Put: PutProduct,
    PutList: PutProductList,
    DeleteList: DeleteProductList,
};

const COM_CODE = 80000

const testDummy = {
    "ProductForm": {
        COM_CODE: COM_CODE,
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

export async function SearchProduct({ criteria }) {
    console.log("criteria", criteria);
    const data =
    {
        "SearchForm": {
            COM_CODE: COM_CODE,
            PROD_CD: `${criteria?.id}`,
            PROD_NM: `${criteria?.name}`,
            PRICE: `${criteria?.price}`,
            IS_USE: `${criteria?.is_use}`
        },
        "SortList": criteria?.Sort,
        "OrderList": [
            "PROD_CD", "PROD_NM", "IS_USE"
        ],
        "CurrentPage": criteria?.CurrentPage ?? 1,
        "Count": 10
    }

    return await Http.Post('/product-search', data);
}

export async function GetProduct({ key }) {
    console.log("GetProduct", key);
    const data = {
        "COM_CODE": COM_CODE,
        "PROD_CD": `${key}`,
    }

    return await Http.Post('/product-get', data);

}

const INSERT_DUMMY = {
    Key: {
        "COM_CODE": COM_CODE,
        "PROD_CD": "88",
    },
    PROD_NM: "99",
    PRICE: 1010,
    WRITE_DT: "2024-08-28T12:34:56"
}

export async function InsertProduct({ insertItem }) {
    const data = {
        Key: {
            "COM_CODE": COM_CODE,
            "PROD_CD": `${insertItem?.id}`,
        },
        PROD_NM: `${insertItem?.name}`,
        PRICE: insertItem?.price,
        WRITE_DT: new Date().toISOString(),
    }

    return await Http.Post('/product-insert', data);
}

const UPDATE_DUMMY = {
    Key: {
        COM_CODE: COM_CODE,
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
            "COM_CODE": COM_CODE,
            "PROD_CD": `${updateItem?.id}`,
        },
        PROD_NM: `${updateItem?.name}`,
        PRICE: updateItem?.price,
        WRITE_DT: new Date().toISOString(),
    }

    return await Http.Post('/product-update', data);
}

export async function PutProduct({ PROD_CD, IS_USE }) {
    const data = {
        Key:
        {
            "COM_CODE": COM_CODE,
            "PROD_CD": PROD_CD,
        },
        IS_USE
    };

    return await Http.Post('/product-put', data);
}

export async function PutProductList({ Keys, IS_USE }) {
    console.log("UpdateProduct", updateItem);
    // {
    //     "COM_CODE": COM_CODE,
    //     "PROD_CD": `${updateItem?.id}`,
    // }
    const data = {
        Keys: [],
        Columns: {
            IS_USE: IS_USE
        }
    };
    data.Keys = Keys;

    return await Http.Post('/product-put-list', data);
}

const DELETE_DUMMY = {
    "COM_CODE": COM_CODE,
    "PROD_CD": "G743"
}

export async function DeleteProduct({ deleteKey }) {
    console.log("DeleteProduct", deleteKey);
    const data = {
        "COM_CODE": COM_CODE,
        "PROD_CD": `${deleteKey}`,
    }
    return await Http.Post('/product-delete', data);
}

export async function DeleteProductList({ Keys }) {

    const keys = Keys.map((item) => {
        return {
            "COM_CODE": COM_CODE,
            "PROD_CD": `${item}`,
        }
    })
    const data = [...keys];

    return await Http.Post('/product-delete-list', data);
}