// This input class was created to simulate something closer to what Game Engine Architecture says.
// There is an unnecessary step to make inputs into a number to do bitwise operations

const _ = require('lodash');

Input = {
  _currentState: 0x0,
  _lastState: 0x0,
  Mouse: {
    position: {
      x: 0, y: 0
    },
    delta: {
      x: 0, y: 0
    },
  },

  // Checks if key is held
  isDown: function(key) {
    return this.keyBits[key] & this._currentState;
  },

  // Checks if key has just been pressed
  isPressed: function(key) {
      return this.keyBits[key] & (this._currentState & ~this._lastState);
  },

  // Checks if key has just been released
  isReleased: function(key) {
      return (this.keyBits[key] & this._currentState) != (this.keyBits[key] & this._lastState);
  },

  onKeyDown: function(key) {
    this._currentState |= this.keyBits[key];
  },

  onKeyUp: function(key) {
    this._currentState &= ~this.keyBits[key];
  },

  onMouseMove: function( mouseX, mouseY, deltaX, deltaY, event  , domElement) {
  	// calculate mouse position in normalized device coordinates
  	// (-1 to +1) for both components
    var rect = domElement.getBoundingClientRect();

    this.Mouse.delta.x = deltaX/rect.width;
    this.Mouse.delta.y = deltaY/rect.height;

    this.Mouse.position.x = 2*(_.clamp(mouseX, rect.left, rect.right) - rect.left)/rect.width - 1;
  	this.Mouse.position.y = 1 - 2*(_.clamp(mouseY, rect.top, rect.bottom) - rect.top)/rect.height;
  },

  update: function() {
    this.Mouse.delta.x = 0;
    this.Mouse.delta.y = 0;

    this._lastState = this._currentState;
  },

  register: function(domElement) {
    // Initialize keybits
    this.keyBits = (_.reduce(this.Keys, function(result, val, key) {
      result.bits[val] = result.acc;
      result.acc *= 2;
      return result;
    }, {acc: 1, bits: {}})).bits;

    window.addEventListener('keyup', e => this.onKeyUp(e.keyCode));
    window.addEventListener('keydown', e => this.onKeyDown(e.keyCode));
    window.addEventListener( 'mousemove', e => this.onMouseMove(e.clientX, e.clientY, e.movementX, e.movementY, e, domElement), false );
  },
  // NOTE: Add more possible keys here (figure keycodes)
  Keys: {
    UP: 38, DOWN: 40, LEFT: 37,  RIGHT: 39,
    SPACE: 32,
    W: 87, A: 65, S: 83, D: 68, Q: 81, E: 69,
    SHIFT: 16, ALT: 18, ENTER: 13, ESC: 27,
  },
};

module.exports = Input;
