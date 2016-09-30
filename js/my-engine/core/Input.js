// This input class was created to simulate something closer to what Game Engine Architecture says.
// There is an unnecessary step to make inputs into a number to do bitwise operations

const _ = require('lodash');

var Input = {
    _currentState: 0x0,
    _lastState: 0x0,
    Mouse: {
        position: {
            x: 0,
            y: 0
        },
        delta: {
            x: 0,
            y: 0
        },
    },

    // TODO: Learn about mouse sensitivity
    Sensitivity: 0.01,
    _locked: false,

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

    onMouseMove: function(mouseX, mouseY, deltaX, deltaY, domElement) {
        var rect = domElement.getBoundingClientRect();

        // NOTE: Might make sense to normalize this to -1 ~ +1
        this.Mouse.delta.x = this._locked ? deltaX * this.Sensitivity : 0;
        this.Mouse.delta.y = this._locked ? deltaY * this.Sensitivity : 0;


        this.Mouse.position.x = this._locked ? 0 :
            2 * (_.clamp(mouseX, rect.left, rect.right) - rect.left) / rect.width - 1;
        this.Mouse.position.y = this._locked ? 0 :
            1 - 2 * (_.clamp(mouseY, rect.top, rect.bottom) - rect.top) / rect.height;
    },

    // Prepares for next frame
    endUpdate: function() {
        this.Mouse.delta.x = 0;
        this.Mouse.delta.y = 0;
        this._lastState = this._currentState;
    },

    init: function(domElement) {
        // Initialize keybits
        this.keyBits = (_.reduce(this.Keys, function(result, val) {
            result.bits[val] = result.acc;
            result.acc *= 2;
            return result;
        }, {
            acc: 1,
            bits: {}
        })).bits;

        // Create evend handlers
        var handleLockChange = () => {
            if (document.pointerLockElement === domElement ||
                document.mozPointerLockElement === domElement) {
                this._locked = true;
            } else {
                this._locked = false;
            }
        };
        var handleMouseDown = () => {
          if(!this._locked) {
            domElement.requestPointerLock = domElement.requestPointerLock ||
                domElement.mozRequestPointerLock;
            domElement.requestPointerLock();
          }
          else {

          }
        };

        // Register listeners
        document.addEventListener('keyup', (e) => this.onKeyUp(e.keyCode));
        document.addEventListener('keydown', (e) => this.onKeyDown(e.keyCode));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e.clientX, e.clientY, e.movementX, e.movementY, domElement), false);
        document.addEventListener('mousedown', handleMouseDown, false);
        document.addEventListener('mousedown', () => this.onKeyDown(this.Keys.MOUSE_L), false);
        document.addEventListener('mouseup', () => this.onKeyUp(this.Keys.MOUSE_L), false);
        document.addEventListener('pointerlockchange', handleLockChange, false);
        document.addEventListener('mozpointerlockchange', handleLockChange, false);
    },

    // NOTE: Add more possible keys here (figure keycodes)
    Keys: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        Q: 81,
        E: 69,
        SHIFT: 16,
        ALT: 18,
        ENTER: 13,
        ESC: 27,
        MOUSE_L: -1,
    },
};

module.exports = Input;
