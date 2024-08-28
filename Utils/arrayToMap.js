
export const arrayToMap = (data = []) => {
    const currentDataObjcet = new Map();
    data.forEach((item) => {
        currentDataObjcet.set(item?.id, { ...item });
    })
    return currentDataObjcet;
}
