/**
 * BASE_URL 설정: 현재 웹 페이지의 프로토콜과 호스트를 기반으로 API 경로를 설정합니다.
 */
// const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
const BASE_URL = `https://localhost:44321/api`;
/**
 * Http 객체: HTTP 요청을 위한 유틸리티 메서드들을 제공하는 객체입니다.
 */
export const Http = {
    /**
     * GET 요청을 수행하는 메서드입니다.
     * 
     * @param {string} url - 요청할 API의 경로 (BASE_URL 이후의 경로).
     * @param {Object} paramObject - 쿼리 파라미터, 헤더, 기타 옵션을 포함하는 객체.
     * @param {Object} [paramObject.queryParams={}] - URL에 추가할 쿼리 파라미터 객체.
     * @param {Object} [paramObject.headers={}] - 요청에 포함할 헤더 객체.
     * @param {Object} [paramObject.options={}] - fetch API에 전달할 추가 옵션.
     * @returns {Promise<Object>} - 서버의 응답을 JSON 형식으로 반환.
     */
    async Get(url, { queryParams = {}, headers = {}, options = {} } = {}) {
        const fullUrl = `${BASE_URL}${url}${createQueryString(queryParams)}`;

        console.groupCollapsed(`%c[HTTP GET] ${fullUrl}`, 'color: green; font-weight: bold;');
        console.log('%cURL:', 'color: green;', fullUrl);
        console.log('%cHeaders:', 'color: blue;', JSON.stringify(headers, null, 2));
        console.log('%cOptions:', 'color: purple;', JSON.stringify(options, null, 2));
        console.groupEnd();

        const response = await fetch(fullUrl, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            ...options
        });
        return await response.json();
    },

    /**
     * POST 요청을 수행하는 메서드입니다.
     * 
     * @param {string} url - 요청할 API의 경로 (BASE_URL 이후의 경로).
     * @param {Object} data - 서버로 전송할 데이터 객체.
     * @param {Object} paramObject - 쿼리 파라미터, 헤더, 기타 옵션을 포함하는 객체.
     * @param {Object} [paramObject.queryParams={}] - URL에 추가할 쿼리 파라미터 객체.
     * @param {Object} [paramObject.headers={}] - 요청에 포함할 헤더 객체.
     * @param {Object} [paramObject.options={}] - fetch API에 전달할 추가 옵션.
     * @returns {Promise<Object>} - 서버의 응답을 JSON 형식으로 반환.
     */
    async Post(url, data = {}, { queryParams = {}, headers = {}, options = {} } = {}) {
        const fullUrl = `${BASE_URL}${url}${createQueryString(queryParams)}`;

        console.groupCollapsed(`%c[HTTP POST] ${fullUrl}`, 'color: yellow; font-weight: bold;');
        console.log('%cURL:', 'color: green;', fullUrl);
        console.log('%cHeaders:', 'color: blue;', JSON.stringify(headers, null, 2));
        console.log('%cOptions:', 'color: purple;', JSON.stringify(options, null, 2));
        console.log('%cBody:', 'color: purple;', JSON.stringify(data, null, 2));
        console.groupEnd();

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data),
            ...options
        });

        console.groupCollapsed(`%c[${response.status}] ${fullUrl}`, 'color: blue; font-weight: bold;');
        console.log('%cResponse:', 'color: purple;', response.statusText);
        console.groupEnd();

        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            error.status = response.status;  // 에러 객체에 상태 코드 추가
            error.data = await response.json();
            error.message = error?.data?.message;
            throw error;
        }

        return response.json();
    },

    /**
     * PUT 요청을 수행하는 메서드입니다.
     * 
     * @param {string} url - 요청할 API의 경로 (BASE_URL 이후의 경로).
     * @param {Object} data - 서버로 전송할 데이터 객체.
     * @param {Object} paramObject - 쿼리 파라미터, 헤더, 기타 옵션을 포함하는 객체.
     * @param {Object} [paramObject.queryParams={}] - URL에 추가할 쿼리 파라미터 객체.
     * @param {Object} [paramObject.headers={}] - 요청에 포함할 헤더 객체.
     * @param {Object} [paramObject.options={}] - fetch API에 전달할 추가 옵션.
     * @returns {Promise<Object>} - 서버의 응답을 JSON 형식으로 반환.
     */
    async Put(url, data = {}, { queryParams = {}, headers = {}, options = {} } = {}) {
        const fullUrl = `${BASE_URL}${url}${createQueryString(queryParams)}`;

        console.groupCollapsed(`%c[HTTP PUT] ${fullUrl}`, 'color: green; font-weight: bold;');
        console.log('%cURL:', 'color: green;', fullUrl);
        console.log('%cHeaders:', 'color: blue;', JSON.stringify(headers, null, 2));
        console.log('%cOptions:', 'color: purple;', JSON.stringify(options, null, 2));
        console.groupEnd();

        const response = await fetch(fullUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data),
            ...options
        });
        return await response.json();
    },

    /**
     * DELETE 요청을 수행하는 메서드입니다.
     * 
     * @param {string} url - 요청할 API의 경로 (BASE_URL 이후의 경로).
     * @param {Object} paramObject - 쿼리 파라미터, 헤더, 기타 옵션을 포함하는 객체.
     * @param {Object} [paramObject.queryParams={}] - URL에 추가할 쿼리 파라미터 객체.
     * @param {Object} [paramObject.headers={}] - 요청에 포함할 헤더 객체.
     * @param {Object} [paramObject.options={}] - fetch API에 전달할 추가 옵션.
     * @returns {Promise<Object>} - 서버의 응답을 JSON 형식으로 반환.
     */
    async Delete(url, { queryParams = {}, headers = {}, options = {} } = {}) {
        const fullUrl = `${BASE_URL}${url}${createQueryString(queryParams)}`;

        console.groupCollapsed(`%c[HTTP DELETE] ${fullUrl}`, 'color: green; font-weight: bold;');
        console.log('%cURL:', 'color: green;', fullUrl);
        console.log('%cHeaders:', 'color: blue;', JSON.stringify(headers, null, 2));
        console.log('%cOptions:', 'color: purple;', JSON.stringify(options, null, 2));
        console.groupEnd();

        const response = await fetch(fullUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            ...options
        });
        return await response.json();
    }
};

/**
 * 쿼리 파라미터 객체를 쿼리 스트링으로 변환하는 함수입니다.
 * 
 * @param {Object} params - 변환할 쿼리 파라미터 객체.
 * @returns {string} - 쿼리 파라미터가 추가된 URL 문자열.
 */
function createQueryString(params) {
    const query = new URLSearchParams(params);
    return query.toString() ? `?${query.toString()}` : '';
}



export class HttpError extends Error {
    constructor(status, statusText, data) {
        super(statusText);
        this.status = status;
        this.data = data;
    }
}

/** BaseHttp
 * 공통 통신과 에러처리 담당
 * @param {*} url 
 * @param {*} options 
 * @returns 
 */
async function baseHttp(url, options = {}) {
    try {
        const response = await fetch(url, options);

        // 정상 데이터
        if (response.ok) return await response.json();

        // 비정상 데이터
        const errorData = await response.json();
        throw new HttpError(response.status, response.statusText, errorData);
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        } else {
            throw new HttpError(0, 'Network error', { message: error.message });
        }
    }
}

const BASE_OPTIONS = {
    // method: 'GET', // HTTP 메서드 (GET, POST, PUT, DELETE 등)
    headers: {
        'Content-Type': 'application/json', // 요청 본문의 타입을 지정
        // 'Authorization': 'Bearer <token>',  // 인증 토큰 (필요한 경우)
    },
    // body: JSON.stringify(data), // POST, PUT 요청 시에 보내는 본문 데이터
    // mode: 'cors', // 'cors', 'no-cors', 'same-origin' 중 선택
    // cache: 'no-cache', // 캐싱 모드 ('default', 'no-cache', 'reload', 'force-cache', 'only-if-cached')
    // credentials: 'same-origin', // 쿠키를 보낼지 여부 ('omit', 'same-origin', 'include')
    // redirect: 'follow', // 리디렉션 처리 모드 ('follow', 'error', 'manual')
    // referrer: 'no-referrer', // 리퍼러 정보 ('no-referrer', 'client')
    // signal: controller.signal // 요청을 취소할 수 있는 AbortController의 신호
};

