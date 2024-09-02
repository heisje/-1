
export const arrayToMap = (data = []) => {
    const currentDataObjcet = new Map();

    if (data?.[0]?.Key?.PROD_CD) {
        data.forEach((item) => {
            currentDataObjcet.set(item?.Key?.PROD_CD, { ...item });
        })
    }

    if (data?.[0]?.IO_DATE) {
        data.forEach((item) => {
            currentDataObjcet.set(`${item?.IO_DATE}-${item?.IO_NO}`, { ...item });
        })
    }

    return currentDataObjcet;
}
