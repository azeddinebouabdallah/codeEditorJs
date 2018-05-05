'use strict';

window.Promise = window.Promise || require('es6-promise');

var currify = require('currify/legacy');
var store = require('fullstore/legacy');
var keyDown = currify(keyDown_);

var remove = bind(removeEl, '.smalltalk');

var BUTTON_OK = ['OK'];
var BUTTON_OK_CANCEL = ['OK', 'Cancel'];

exports.alert = function (title, msg) {
    return showDialog(title, msg, '', BUTTON_OK, { cancel: false });
};

exports.prompt = function (title, msg) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var options = arguments[3];

    var type = getType(options);

    var val = String(value).replace(/"/g, '&quot;');

    var valueStr = '<input type="' + type + '" value="' + val + '" data-name="js-input">';

    return showDialog(title, msg, valueStr, BUTTON_OK_CANCEL, options);
};

exports.confirm = function (title, msg, options) {
    return showDialog(title, msg, '', BUTTON_OK_CANCEL, options);
};

function getType() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var type = options.type;


    if (type === 'password') return 'password';

    return 'text';
}

function getTemplate(title, msg, value, buttons) {
    var encodedMsg = msg.replace(/\n/g, '<br>');

    return '<div class="page">\n        <div data-name="js-close" class="close-button"></div>\n        <header>' + title + '</header>\n        <div class="content-area">' + encodedMsg + value + '</div>\n        <div class="action-area">\n            <div class="button-strip"> ' + buttons.map(function (name, i) {
        return '<button tabindex=' + i + ' data-name="js-' + name.toLowerCase() + '">' + name + '</button>';
    }).join('') + '\n            </div>\n        </div>\n    </div>';
}

function showDialog(title, msg, value, buttons, options) {
    var ok = store();
    var cancel = store();

    var dialog = document.createElement('div');
    var closeButtons = ['cancel', 'close', 'ok'];

    var promise = new Promise(function (resolve, reject) {
        var noCancel = options && !options.cancel;
        var empty = function empty() {};

        ok(resolve);
        cancel(noCancel ? empty : reject);
    });

    var tmpl = getTemplate(title, msg, value, buttons);

    dialog.innerHTML = tmpl;
    dialog.className = 'smalltalk';

    document.body.appendChild(dialog);

    find(dialog, ['ok', 'input']).forEach(function (el) {
        return el.focus();
    });

    find(dialog, ['input']).forEach(function (el) {
        el.setSelectionRange(0, value.length);
    });

    addListenerAll('click', dialog, closeButtons, function (event) {
        return closeDialog(event.target, dialog, ok(), cancel());
    });

    ['click', 'contextmenu'].forEach(function (event) {
        return dialog.addEventListener(event, function () {
            return find(dialog, ['ok', 'input']).forEach(function (el) {
                return el.focus();
            });
        });
    });

    dialog.addEventListener('keydown', keyDown(dialog, ok(), cancel()));

    return promise;
}

function keyDown_(dialog, ok, cancel, event) {
    var KEY = {
        ENTER: 13,
        ESC: 27,
        TAB: 9,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    var keyCode = event.keyCode;
    var el = event.target;

    var namesAll = ['ok', 'cancel', 'input'];
    var names = find(dialog, namesAll).map(getDataName);

    switch (keyCode) {
        case KEY.ENTER:
            closeDialog(el, dialog, ok, cancel);
            event.preventDefault();
            break;

        case KEY.ESC:
            remove();
            cancel();
            break;

        case KEY.TAB:
            if (event.shiftKey) tab(dialog, names);

            tab(dialog, names);
            event.preventDefault();
            break;

        default:
            ['left', 'right', 'up', 'down'].filter(function (name) {
                return keyCode === KEY[name.toUpperCase()];
            }).forEach(function () {
                changeButtonFocus(dialog, names);
            });

            break;
    }

    event.stopPropagation();
}

function getDataName(el) {
    return el.getAttribute('data-name').replace('js-', '');
}

function changeButtonFocus(dialog, names) {
    var active = document.activeElement;
    var activeName = getDataName(active);
    var isButton = /ok|cancel/.test(activeName);
    var count = names.length - 1;
    var getName = function getName(activeName) {
        if (activeName === 'cancel') return 'ok';

        return 'cancel';
    };

    if (activeName === 'input' || !count || !isButton) return;

    var name = getName(activeName);

    find(dialog, [name]).forEach(function (el) {
        el.focus();
    });
}

var getIndex = function getIndex(count, index) {
    if (index === count) return 0;

    return index + 1;
};

function tab(dialog, names) {
    var active = document.activeElement;
    var activeName = getDataName(active);
    var count = names.length - 1;

    var activeIndex = names.indexOf(activeName);
    var index = getIndex(count, activeIndex);

    var name = names[index];

    find(dialog, [name]).forEach(function (el) {
        return el.focus();
    });
}

function closeDialog(el, dialog, ok, cancel) {
    var name = el.getAttribute('data-name').replace('js-', '');

    if (/close|cancel/.test(name)) {
        cancel();
        remove();
        return;
    }

    var value = find(dialog, ['input']).reduce(function (value, el) {
        return el.value;
    }, null);

    ok(value);
    remove();
}

function find(element, names) {
    var notEmpty = function notEmpty(a) {
        return a;
    };
    var elements = names.map(function (name) {
        return element.querySelector('[data-name="js-' + name + '"]');
    }).filter(notEmpty);

    return elements;
}

function addListenerAll(event, parent, elements, fn) {
    find(parent, elements).forEach(function (el) {
        return el.addEventListener(event, fn);
    });
}

function removeEl(name) {
    var el = document.querySelector(name);

    el.parentElement.removeChild(el);
}

function bind(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return function () {
        return fn.apply(undefined, args);
    };
}