import { abstractObjectState } from "./abstractObjectState.js";

// 왜 상태를 이렇게 저장?
// 전역에 데이터를 저장해두고 옮기는게 너무 많아졌다. -> 하지만 여기있는지 어떻게 알지? -> 메인에 두자..
class CheckBoxStateClass extends abstractObjectState {
    constructor(defaultData) {
        super(defaultData);
    }
}

const CheckBoxState = new CheckBoxStateClass({ selectedIds: [], maxCountSelect: 0, countSelected: 0 });
export default CheckBoxState;

// 사용 예
// const checkBoxState = CheckBoxState.getState();
// checkBoxState.countSelected += 1
// CheckBoxState.setState({ ...checkBoxState });
// CheckBoxState.getState();