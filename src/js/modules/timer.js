import {formatTime} from '../utils/time.js';

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

export default Timer;