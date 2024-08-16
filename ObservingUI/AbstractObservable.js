
export class AbstractObservable {
    constructor() {
        this._observers = [];
    }

    set state(newState) {
        this._state = newState;
        this.notify(this._state);
    }

    get state() {
        return this._state;
    }

    getState() {
        return this._state;
    }

    register(observer) {
        this._observers.push(observer);
    }

    unregister(observer) {
        this._observers = this._observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this._observers.forEach(observer => observer.update(data));
    }
}
