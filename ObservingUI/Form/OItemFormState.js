import { OAbstractFormState } from "./OAbstractFormState.js";

class OItemFormState extends OAbstractFormState {

    // override
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
    }
}

export const OSaleFormState = new OItemFormState();