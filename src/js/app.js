'use strict';

import '../css/app.scss';

//
// BUTTON PICKER
//

var ButtonPicker = {
    onMouseClick: function onMouseClick(e) {
        var target = e.target;
        e.preventDefault();
        e.stopPropagation();

        var button = target.closest('button, input[type="submit"],.btn, .Button , a, [role="button"]');
        if (button) {
            ButtonPicker.options.onButtonPick(button);
        }
    },
    onFocus: function onFocus(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    start: function start() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        ButtonPicker.options = options;
        document.addEventListener('click', ButtonPicker.onMouseClick, true);
        document.addEventListener('focus', ButtonPicker.onFocus, true);
    },
    stop: function stop() {
        document.removeEventListener('click', ButtonPicker.onMouseClick, true);
        document.removeEventListener('focus', ButtonPicker.onFocus, true);
    }
};

//
// TIMER
//

var Timer = {
    createEl: function createEl() {
        var el = document.createElement('div');
        el.classList.add('TC-timer');
        el.innerHTML = '\n            <span class="TC-timer-countdown"></span>\n            <span class="TC-timer-cancel">X</span>\n        ';
        Timer.options.region.appendChild(el);
        Timer.el = el;
        Timer.el.addEventListener('click', Timer.options.onCancel, true);
    },
    renderEl: function renderEl() {
        Timer.el.querySelector('.TC-timer-countdown').innerHTML = formatTime(Timer.remainingSeconds);
    },
    removeEl: function removeEl() {
        Timer.el.remove();
    },
    tick: function tick() {
        Timer.remainingSeconds--;
        Timer.renderEl();
        if (Timer.remainingSeconds === 0) {
            Timer.stop();
            Timer.options.onFinish();
        }
    },
    disableEvent: function disableEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    warnBeforeUnload: function warnBeforeUnload(e) {
        e.returnValue = 'A timer is running. Are you sure you want to leave ?';
    },
    start: function start(options) {
        Timer.options = options;
        Timer.remainingSeconds = 600;
        Timer.createEl();
        Timer.renderEl();

        Timer.intervalId = setInterval(Timer.tick, 1000);

        document.addEventListener('wheel', Timer.disableEvent, true);
        document.addEventListener('touchmove', Timer.disableEvent, true);
        document.addEventListener('keydown', Timer.disableEvent, true);

        window.addEventListener('beforeunload', Timer.warnBeforeUnload, true);
    },
    stop: function stop() {
        Timer.removeEl();
        clearInterval(Timer.intervalId);
        document.removeEventListener('wheel', Timer.disableEvent, true);
        document.removeEventListener('touchmove', Timer.disableEvent, true);
        document.removeEventListener('keydown', Timer.disableEvent, true);

        window.removeEventListener('beforeunload', Timer.warnBeforeUnload, true);
    }
};

// STATES :
// - PICK_BUTTON
// - TIMER

var App = {

    currentModule: ButtonPicker,

    createOverlay: function createOverlay() {
        App.overlay = document.createElement('div');
        App.overlay.id = 'TC-overlay';
        document.body.appendChild(App.overlay);
    },
    removeOverlay: function removeOverlay() {
        App.overlay.remove();
    },
    onKeyUp: function onKeyUp(e) {
        if (e.key == 'Escape') {
            App.stop();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    startModule: function startModule(module, options) {
        App.currentModule.stop();
        App.currentModule = module;
        App.currentModule.start(options);
    },
    onButtonPick: function onButtonPick(button) {
        ButtonPicker.stop();
        App.selectedButton = button;
        App.overlay.classList.add('is-showing-timer');
        App.startModule(Timer, {
            region: App.overlay,
            button: button,
            onFinish: App.onTimerFinish,
            onCancel: function onCancel() {
                return App.stop();
            }
        });
    },
    onTimerFinish: function onTimerFinish() {
        App.stop();
        App.selectedButton.click();
    },
    start: function start() {
        App.createOverlay();
        App.startModule(ButtonPicker, { onButtonPick: App.onButtonPick });
        document.addEventListener('keyup', App.onKeyUp, true); // todo do better
    },
    stop: function stop() {
        App.removeOverlay();
        App.currentModule.stop();
        document.removeEventListener('keyup', App.onKeyUp, true);
    }
};

App.start();

// UTILS
function formatTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = seconds % 60;
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(function (a) {
        return a;
    }).join(':');
}