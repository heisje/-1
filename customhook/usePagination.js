const useState = (function () {
    let state = {
        counter: 0
    };

    return {
        getState: function () {
            return state;
        },
        setState: function (newState) {
            state = newState;
        },
    };
})();
