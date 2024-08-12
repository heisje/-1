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

export const OCurrentData = new OState();