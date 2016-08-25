// TODO: Connect this to firebase to guarantee unique names overall;
const $ = require('jquery');
const _ = require('lodash');
const Assets = require('../engine/AssetLoader').Assets;


Generator = {
  adjectives: [
  	"like",  	   "calm",  	  "adamant",  	  "crabby",  	     "free",  	  "picayune",  	"furry",
  	"venomous",  "exciting",  "merciful",  	  "bloody",  	     "homeless",  "lacking",  	"descriptive",
    "royal",     "receptive", "resolute",  	  "kaput",  	     "unequal",  	"curious",  	"rabid",
    "different", "steadfast", "bewildered",  	"bustling",  	   "zonked",  	"eminent",  	"regular",
  	"delirious", "mature",  	"rambunctious", "guttural",  	   "orange",  	"wealthy",  	"chemical",
    "jagged",  	 "noxious",  	"willing",  	  "embarrassed",   "voiceless", "sable",  	  "shallow",
  	"malicious", "garrulous", "historical",  	"obese",  	     "gainful",  	"didactic",   "lovely"
  ],
  names: [
    "dugong",    "mongoose",  "marten",       "beetle",        "hog",       "rhinoceros", "fawn",
    "lizard",    "crocodile", "antelope",     "iguana",        "mule",      "jaguar",     "gopher",
    "fox",       "colt",      "coati",        "dingo",         "capybara",  "ape",        "burro",
    "porcupine", "panda",     "wombat",       "eagle",         "alpaca",    "pronghorn",  "bear",
    "fish",      "aoudad",    "goat",         "cheetah",       "baboon",    "shrew",      "beaver",
    "kangaroo",  "octopus",   "chipmunk",     "cat",           "porpoise",  "badger",     "marmoset",
    "mandrill",  "civet",     "whale",        "bat",           "lion",      "falcon",     "frog"
  ],
  init: function() {
      this.adjectives = _.shuffle(this.adjectives);
      this.names = _.shuffle(this.names);
      this.initialized = true;
  },
  getUnique: function () {
    return this.adjectives.pop() + " " + this.names.pop();
  }
};

module.exports = Generator;
