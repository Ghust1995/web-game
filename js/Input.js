// This input class was created to simulate something closer to what Game Engine Architecture says.
// There is an unnecessary step to make inputs into a number to do bitwise operations

Input = {
  _currentState: 0x0,
  _lastState: 0x0,

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

  update: function() {
    this._lastState = this._currentState;
  },

  registerKeys: function() {
    window.addEventListener('keyup', e => this.onKeyUp(e.keyCode));
    window.addEventListener('keydown', e => this.onKeyDown(e.keyCode));
  },
  // TODO: Add more possible keys here (figure keycodes)
  Keys: {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
  },

  // TODO: Can be generated in "Compile Time"
  keyBits: {
    38: 0x1,
    40: 0x2,
    37: 0x4,
    39: 0x8,
    32: 0x10
  },
};

module.exports = Input;
