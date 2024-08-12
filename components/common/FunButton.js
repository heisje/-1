// 만든 이유. 유지보수
// class 객체가 여러 활용면에선 좋으나, 오히려 결합도가 증가하여 (this등 복잡한 바인드 문제)
// 직관적으로 해결하기 위해 분리.
export function FuncButton({
    text = 'Button',
    classes = [],
    onClick = null,
    parent = document.body, attributes = []
} = {}) {
    const button = document.createElement('button');
    button.textContent = text;

    if (classes.length > 0) {
        button.classList.add(...classes);
    }

    if (attributes) {
        attributes.forEach(({ qualifiedName, value }) => {
            button.setAttribute(qualifiedName, value);
        })
    }

    if (onClick) {
        button.addEventListener('click', onClick);
    }

    parent.appendChild(button);

    return button;
}