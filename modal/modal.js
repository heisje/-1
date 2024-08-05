

export class Modal {
    constructor(targetHtml, openType) {
        this.newWindow = null;
        this._open(targetHtml, openType);
    }

    _open(targetHtml, openType) {
        this.newWindow = window.open(
            targetHtml,
            openType + targetHtml,
            "width=600,height=400"
        );
        this._addEvent();
    }

    _addEvent() {
        window.addEventListener("message", this._messageHandler);
    }

    _removeEvent() {
        window.removeEventListener("message", this._messageHandler);
    }

    _messageHandler = (event) => {
        if (event.origin !== window.location.origin) {
            return;
        }
        if (event.data === "popup_closed") {
            this._removeEvent();
        }
        document.getElementById("message").innerText =
            "Message from new window: " + event.data;
    };
}