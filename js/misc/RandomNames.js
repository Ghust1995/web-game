// TODO: Connect this to firebase to guarantee unique names overall;

const $ = require('jquery');
const _ = require('lodash');
const Assets = require('../engine/AssetLoader').Assets;

Generator = {
  initialized: false,
  init: function() {
    if(!this.initialized) {
      this.adjectives = _.shuffle(Assets.randomNames.adjectives);
      this.names = _.shuffle(Assets.randomNames.names);
      this.initialized = true;
    }
    else {
      console.warn("Generator already initialized");
    }
  },
  getUnique: function () {
    return this.adjectives.pop() + " " + this.names.pop();
  }
};

module.exports = Generator;
