import { OSortState } from "../ObservingUI/OState.js";

// DOM이 로드된 후 이벤트 리스너 추가
// 초기화, 기본 데이터 주입 필요
export const InitOrder = () => {
    const arrows = document.querySelectorAll(".sort-arrows");
    arrows.forEach(arrow => {
        // UI 초기화
        const order = arrow.getAttribute("data-order-type");
        arrow.querySelectorAll('.arrow').forEach((elem, index) => {
            elem.classList.remove('arrow-active');
            if ((order === "ASC" && index === 0) || (order === "DESC" && index === 1)) {
                elem.classList.add('arrow-active');
            }
        });

        // 이벤트 삽입
        arrow.addEventListener("click", async () => {
            ToggleOrder(arrow);
        });
    });
}

// 정렬 방향 스왑 함수
export function ToggleOrder(arrow) {
    const column = arrow.getAttribute("data-order");
    const currentOrder = arrow.getAttribute("data-order-type");
    const newOrder = currentOrder === "ASC" ? "DESC" : "ASC";
    arrow.setAttribute("data-order-type", newOrder);

    // 화살표 색상 업데이트
    arrow.querySelectorAll('.arrow').forEach((elem, index) => {
        elem.classList.remove('arrow-active');
        if ((newOrder === "ASC" && index === 0) || (newOrder === "DESC" && index === 1)) {
            elem.classList.add('arrow-active');
        }
    });

    const state = OSortState?.getState();
    if (state.has(column)) {
        state.delete(column);
        state.set(column, newOrder);
    } else {
        state.set(column, newOrder);
    }
    OSortState.notify();
}