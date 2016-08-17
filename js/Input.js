Input = {
  _currentState: 0x0,
  _lastState: 0x0,

  isDown: function(key) {
    return this.keyBits[key] & this._currentState;
  },

  isPressed: function(key) {
      return this.keyBits[key] & (this._currentState & ~this._lastState);
  },

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
