export class Modal {
    constructor(targetHtml, openType) {
        this.newWindow = window.open(
            targetHtml,
            openType + targetHtml,
            "width=600,height=400"
        );
        return this;
    }
}
