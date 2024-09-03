
export class AbstractObservable {
    constructor() {
        this._observers = [];
    }

    set state(newState) {
        this._state = newState;
        this.notify();
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

    notify() {
        this._observers.forEach(observer => observer.update(this._state));
    }

    // 특정 key 요소만 업데이트하는 메서드
    updateKey(key, value) {
        // 기존 상태를 복사하여 업데이트
        const newState = { ...this._state, [key]: value };
        this.state = newState; // 상태 설정을 통해 변경된 상태를 알림

    }

    getKey(key) {
        return this._state?.[key];
    }
}
