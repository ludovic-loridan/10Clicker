//
// BUTTON PICKER
//

const ButtonPicker = {
  onMouseClick(e) {
      const target = e.target;
      e.preventDefault();
      e.stopPropagation();
  
  
      const button = target.closest('button, input[type="submit"],.btn, .Button , a, [role="button"]');
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

export default ButtonPicker;