import { AbstractElement } from "./AbstractElement.js";

// this로 지정해두고 참조하는 것이 있으면 메모리 누수가 생성될 것이라 예상되어 .render시 객체 주입
export class CCheckBox extends AbstractElement {
    constructor(options) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        return super(checkbox, options);
    }
}