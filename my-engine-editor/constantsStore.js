import {EventEmitter} from 'events';

var _constants = [123, 234, 345];


class ConstantsStore extends EventEmitter{
  get() {
    return _constants;
  }
}



module.exports = ConstantsStore;
