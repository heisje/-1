class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
    }
}

export class OAbstractFormState {
    constructor() {
        this.state = new Map();
        this._default = new Map();
        this._observers = [];
    }

    setState(newState) {
        try {
            if (this._abstract_validate(newState)) {
                this._state = newState;
                this.notify(this._state);
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    setDefault() {
        this._default = defaultData;
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

    _abstract_validate(newState) {
        // 날짜 품목 수량 단가

        if (!newState.hasOwnProperty('name') || newState.name.trim() === "") {
            throw new ValidationError("Invalid state: 'name' is required and cannot be empty");
        }

        if (!newState.hasOwnProperty('date')) {
            throw new ValidationError("날짜를 입력해주세요", 'date');
        } else if (isNaN(Date.parse(newState.date))) {
            throw new ValidationError("날짜가 잘못되었습니다.", 'date');
        }
        // 가격 확인
        if (!newState.hasOwnProperty('price') || newState.price.trim() === "") {
            throw new ValidationError("가격을 입력해주세요", 'price');
        } else if (isNaN(parseInt(newState.price, 10))) {
            throw new ValidationError("가격은 숫자여야 합니다.", 'price');
        }

        // 수량 확인
        if (!newState.hasOwnProperty('count') || newState.count.trim() === "") {
            throw new ValidationError("수량을 입력해주세요", 'count');
        } else if (isNaN(parseInt(newState.count, 10))) {
            throw new ValidationError("수량은 숫자여야 합니다.", 'count');
        }
        return true;
    }
}
