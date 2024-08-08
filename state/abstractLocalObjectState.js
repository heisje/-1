export class AbstractLocalObjectState {
    constructor(defaultData, key) {
        this.key = key;
        const storedState = localStorage.getItem('state-' + this.key);
        if (storedState) {
            this.state = JSON.parse(storedState);
        } else {
            this.state = { ...defaultData };
            this.saveState();
        }
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...newState };
        this.saveState();
    }

    saveState() {
        localStorage.setItem('state-' + this.key, JSON.stringify(this.state));
    }
}
