
//
// BUTTON PICKER
//


const ButtonPicker = {
    onMouseClick(e) {
        const target = e.target;
        e.preventDefault();
        e.stopPropagation();
    
    
        const button = target.closest('button, input[type="submit"],.btn,a');
        if (button) {
            ButtonPicker.options.onButtonPick(button);
        }
        
    },
    
    onFocus(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    
    start(options={}) {
        ButtonPicker.options = options;
        document.addEventListener('click', ButtonPicker.onMouseClick, true);
        document.addEventListener('focus', ButtonPicker.onFocus, true);
    },
    
    stop() {
        document.removeEventListener('click', ButtonPicker.onMouseClick, true);
        document.removeEventListener('focus', ButtonPicker.onFocus, true);
    }
};


//
// TIMER
//

const Timer = {

    createEl() {
        const el = document.createElement('div');
        el.classList.add('TC-timer');
        el.innerHTML = `
            <span class="TC-timer-countdown"></span>
            <span class="TC-timer-cancel">X</span>
        `;
        Timer.options.region.appendChild(el);
        Timer.el = el;
        Timer.el.addEventListener('click', Timer.options.onCancel, true);
    },

    renderEl() {
        Timer.el.querySelector('.TC-timer-countdown').innerHTML = formatTime(Timer.remainingSeconds);
    },

    removeEl() {
        Timer.el.remove();
    },

    tick() {
        Timer.remainingSeconds--;
        Timer.renderEl()
        if (Timer.remainingSeconds === 0) {
            Timer.stop();
            Timer.options.onFinish();
        }
    },

    disableEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    },

    warnBeforeUnload(e) {
        e.returnValue = 'A timer is running. Are you sure you want to leave ?';
    },

    start(options) {
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

    stop() {
        Timer.removeEl();
        clearInterval(Timer.intervalId);
        document.removeEventListener('wheel', Timer.disableEvent, true);
        document.removeEventListener('touchmove', Timer.disableEvent, true);
        document.removeEventListener('keydown', Timer.disableEvent, true);

        window.removeEventListener('beforeunload', Timer.warnBeforeUnload, true);
    }
}
 

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






// UTILS
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h,
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s,
    ].filter(a => a).join(':');
  }