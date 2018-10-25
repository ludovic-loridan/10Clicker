import '../scss/app.scss'
import ButtonPicker from './modules/buttonPicker.js';
import Timer from './modules/timer.js';

// STATES :
// - PICK_BUTTON
// - TIMER

const App = {

    currentModule: ButtonPicker,

    createOverlay() {
        App.overlay = document.createElement('div');
        App.overlay.id = 'TC-overlay';
        document.body.appendChild(App.overlay);
    },

    removeOverlay() {
        App.overlay.remove();
    },

    onKeyUp(e) {
        if (e.key == 'Escape') {
            App.stop();
        }
        e.preventDefault();
        e.stopPropagation();
    },

    startModule(module, options) {
        App.currentModule.stop();
        App.currentModule = module;
        App.currentModule.start(options);
    },

    onButtonPick(button) {
        ButtonPicker.stop();
        App.selectedButton = button;
        App.overlay.classList.add('is-showing-timer');
        App.startModule(Timer, {
            region: App.overlay,
            button,
            onFinish: App.onTimerFinish,
            onCancel: () => App.stop()
        });
    },

    onTimerFinish() {
        App.stop();
        App.selectedButton.click();
    },

    start() {
        App.createOverlay();
        App.startModule(ButtonPicker, {onButtonPick: App.onButtonPick});
        document.addEventListener('keyup', App.onKeyUp, true); // todo do better
    },

    stop() {
        App.removeOverlay();
        App.currentModule.stop();
        document.removeEventListener('keyup', App.onKeyUp, true);
    }
}

App.start();
