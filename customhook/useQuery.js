
// 1회성이라 즉시 실행 후 캐싱
export const useQuery = (() => {
    let cachedParams = null;

    return () => {
        if (cachedParams) {
            return cachedParams;
        }

        const queryString = window.location.search.substring(1);
        const params = {};

        queryString.split("&").forEach(part => {
            const [key, value] = part.split("=");
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });

        cachedParams = params;
        return cachedParams;
    };
})();
