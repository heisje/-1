function createItemNameCard(id, event) {
    // 이벤트 전파를 막음
    event.stopPropagation();
    event.preventDefault();

    // 특정 요소를 선택합니다.
    const targetElement = document.querySelector(id);

    // 새로운 button 요소를 생성합니다.
    const button = document.createElement('button');
    button.classList.add('itemName-card');
    button.textContent = 'Click Me';

    // button 클릭 시 이벤트 전파를 막는 이벤트 리스너를 추가합니다.
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // 이벤트 전파를 막음
        e.preventDefault();  // 기본 동작을 막음 (예: form 제출 방지)
        console.log('Button clicked, but form submission prevented.');
    });

    // button 요소를 targetElement 안에 추가합니다.
    targetElement.appendChild(button);
}

document.addEventListener('DOMContentLoaded', () => {
    // 필요한 경우 초기화 코드를 여기에 추가할 수 있습니다.
});
