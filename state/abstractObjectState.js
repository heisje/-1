export class abstractObjectState {
    constructor(defaultData) {
        this.state = { ...defaultData };
    }

    getState() {
        return this.state;
    }

    setState(newSwtate) {
        this.state = { ...newState };
    }
}