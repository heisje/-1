export class Modal {
    constructor(targetHtml, openType, callback) {
        this.newWindow = window.open(
            targetHtml,
            openType + targetHtml,
            "width=600,height=400"
        );
    }

    _messageHandler = (event) => {
        if (event.origin !== window.location.origin) {
            document.getElementById("message").innerText = event.data;
        }

        this._callback(event.data);

        if (event.data === "popup_closed") {
            this._removeEvent();
        }
    }

    _removeEvent() {
        window.removeEventListener("message", this._messageHandler);
    }
}
