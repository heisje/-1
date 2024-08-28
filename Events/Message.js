// MESSAGE
export function SendMessage(message = { messageType: 'reSearchData' }) {
    window.opener.postMessage(message, window.location.origin);
}