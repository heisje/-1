// OPEN NEW MODAL

import { queryObjectToURL } from "../util/query.js";
import { Modal } from "./modal.js";

// TODO : 분리
export const handleOpenWindow = (event) => {
    const href = event.currentTarget.getAttribute("data-href");
    const openType = event.currentTarget.getAttribute("data-query-modal-type");

    // data-query-..로 정의해논 데이터를 전부 쿼리로 생성
    const queryObject = {};

    Array.from(event.currentTarget.attributes).forEach(attr => {
        if (attr.name.startsWith('data-query-')) {
            const key = attr.name.replace('data-query-', '');
            const value = attr.value;
            queryObject[key] = value;
        }
    });

    const row = event.currentTarget.closest('tr');
    if (row) {
        const id = row.getAttribute('id');
        queryObject['id'] = id;
    }

    const url = queryObjectToURL(href, queryObject);

    return new Modal(url, openType);
}