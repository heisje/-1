export function urlParser() {
    // 현재 URL에서 path 부분을 추출
    const url = window.location.href;
    const path = new URL(url).pathname;

    // path를 '/'로 분할하고, 마지막 부분을 추출
    const fileName = path.split('/').pop();

    // 파일명에서 확장자를 제거하여 'saleForm'을 추출
    const pageName = fileName.split('.')[0];
    return { url, pageName };
}