const _ = require('lodash');

const GameObject = require('./GameObject');

function Instantiate(rawGOGenerator, name, parent, params) {
    // NOTE: Experimental thing to make params not necessary... Might be slow...
    var raw = (_.spread(rawGOGenerator))(_.map(getArgs(rawGOGenerator), (arg) => params[arg]));

    // Recursively constructs game objects and add them to their parents;
    InstantiateRecursive(raw, name, parent);
    return raw;
}

function InstantiateRecursive(raw, name, parent) {
    var go = new GameObject(name,
        raw.transform,
        raw.components,
        parent);

    _.forIn(raw.children, function(childRaw, childName) {
        InstantiateRecursive(childRaw, childName, go);
    });
}

// Thing to get function parameters
function getArgs(func) {
    // Match ... (param1, param2) ... => "param1, param2"
    var args = func.toString().match(/\(([^)]*)\)/)[1];

    // Split "param1, param2" => ["param1", "param2"]
    return _.map(
        _.split(args, ','),
        (arg) => arg.replace(/\/\*.*\*\//, '').trim()
    );
}

module.exports = Instantiate;
