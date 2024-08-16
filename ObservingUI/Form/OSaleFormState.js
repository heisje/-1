import { OAbstractFormState } from "../OAbstractFormState.js";

class OSaleFormState extends OAbstractFormState {

    // override
    _abstract_validate(newState) {
        const result = {}
        // 날짜 품목 수량 단가
        if (!newState.hasOwnProperty('items')) {
            result.item = "품목을 입력해주세요";
        }

        // 날짜 품목 수량 단가
        if (!newState.hasOwnProperty('date')) {
            result.date = "날짜를 입력해주세요";
        } else if (isNaN(Date.parse(newState.date))) {
            result.date = "날짜가 잘못되었습니다.";
        }
        // 가격 확인
        if (!newState.hasOwnProperty('price') || newState.price.trim() === "") {
            result.price = "가격이 잘못되었습니다.";
        } else if (isNaN(parseInt(newState.price, 10))) {
            result.price = "가격은 숫자여야합니다.";
        }

        // 수량 확인
        if (!newState.hasOwnProperty('count') || newState.count.trim() === "") {
            result.count = "수량을 입력해주세요.";
        } else if (isNaN(parseInt(newState.count, 10))) {
            result.count = "수량은 숫자여야합니다.";
        }

        if (result != {}) {
            return result;
        }
        return result;
    }
}

export const OSaleFormState = new OSaleFormState();