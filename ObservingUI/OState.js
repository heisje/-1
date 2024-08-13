import { Observable } from "./Observable.js";

class OState extends Observable {
    constructor() {
        super();
        this._state = null;
    }

    post(newValue) {
        this.state = newValue;
    }

    update(updatedValue) {
        this.state = updatedValue;
    }

    delete() {
        this.state = null;
    }
}

// 1개의 객체 데이터당 1개의 export
export const OTableState = new OState();