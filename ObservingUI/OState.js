import { AbstractObservable } from "./AbstractObservable.js";

class OState extends AbstractObservable {
    constructor() {
        super();
        this._state = null;
    }

    update(updatedValue) {
        this.state = updatedValue;
    }

    // delete() {
    //     this.state = null;
    // }
}

// 1개의 객체 데이터당 1개의 export = 개발시 쉬운 파일참조
// TODO: 관리 폴더 구조를 변경
export const OTableState = new OState();
export const OPageState = new OState();
export const OSortState = new OState();