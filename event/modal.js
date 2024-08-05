import { Modal } from "../modal/modal.js";
import { queryObjectToURL } from "../util/query.js";

export function handleOpenWindow(event) {
    console.log('_handleOpenWindow', event);

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
    const url = queryObjectToURL(href, queryObject);

    new Modal(url, openType);
}