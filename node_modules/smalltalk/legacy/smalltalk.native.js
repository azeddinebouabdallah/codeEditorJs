'use strict';

window.Promise = window.Promise || require('es6-promise');

exports.alert = function (title, message) {
    var promise = new Promise(function (resolve) {
        alert(message);
        resolve();
    });

    return promise;
};

exports.prompt = function (title, message, value, options) {
    var o = options;
    var promise = new Promise(function (resolve, reject) {
        var noCancel = o && !o.cancel;
        var result = prompt(message, value);

        if (result !== null) return resolve(result);

        if (noCancel) return;

        reject();
    });

    return promise;
};

exports.confirm = function (title, message, options) {
    var o = options;
    var noCancel = o && !o.cancel;
    var promise = new Promise(function (resolve, reject) {
        var is = confirm(message);

        if (is) return resolve();

        if (noCancel) return;

        reject();
    });

    return promise;
};