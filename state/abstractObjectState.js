export class abstractObjectState {
    constructor(defaultData) {
        this.state = { ...defaultData };
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...newState };
    }

    addState(newKeyValue) {
        this.state = { ...this.state, ...newKeyValue }
    }

    changeKeyState(newKeyValue) {
        this.state = { ...this.state, ...newKeyValue }
    }
}