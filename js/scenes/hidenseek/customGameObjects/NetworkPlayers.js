//Node Modules - Usually used
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const Instantiate = require('my-engine/core/Instantiate');

// Custom Game Objects
const ServerPlayerView = require('../customGameObjects/ServerPlayerView');

module.exports = (Firebase) => ({
    components: {
        NetworkPlayers: {
            PLAYER_LIMIT: 10,
            BaseGameObject: ServerPlayerView,
            init: function(go) {
                var getNetPlayer = function(data) {
                    var val = data.val();
                    var position = val.transform.position;
                    var scale = val.transform.scale;
                    var rotation = val.transform.rotation;
                    var name = val.name;

                    // TODO: Make this transform setting easier
                    Instantiate(this.BaseGameObject, name, go, {
                        transform: {
                            position: new THREE.Vector3(position.x, position.y, position.z),
                            rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
                            scale: new THREE.Vector3(scale.x, scale.y, scale.z)
                        },
                        key: data.key
                    });
                }.bind(this);

                var updateNetPlayer = function(data) {
                    var val = data.val();
                    var position = val.transform.position;
                    var scale = val.transform.scale;
                    var rotation = val.transform.rotation;
                    var player = _.find(go.children, (c) => c.components.ServerNetworkTransform &&
                        c.components.ServerNetworkTransform.key === data.key);
                    if (!player) {
                        console.warn("No player found on transform update");
                        return;
                    }
                    player.components.ServerNetworkTransform.emitTransformChange({
                        position: new THREE.Vector3(position.x, position.y, position.z),
                        rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
                        scale: new THREE.Vector3(scale.x, scale.y, scale.z)
                    });
                };

                var removeNetPlayer = function(data) {
                    var player = _.find(go.children, (c) => c.components.ServerNetworkTransform &&
                        c.components.ServerNetworkTransform.key === data.key);
                    console.log("DESTROYED SOMEONE");
                    go.remove(player);
                };

                Firebase.database.ref("players").limitToLast(10).on('child_added', getNetPlayer);
                Firebase.database.ref("players").limitToLast(10).on('child_changed', updateNetPlayer);
                Firebase.database.ref("players").on('child_removed', removeNetPlayer);
            }
        }
    }
});
