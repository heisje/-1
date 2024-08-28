// 쿼리스트링을 url로
const _queryString = (queryObject) =>
    Object.keys(queryObject)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`)
        .join('&');

export const queryObjectToURL = (href, queryObject) => {
    const queryStringValue = _queryString(queryObject);
    return `${href}?${queryStringValue}`;
};
