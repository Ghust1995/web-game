//Node Modules - Usually used
const THREE = require('three');
const _ = require('lodash');

// Engine modules
const Instantiate = require('my-engine/core/Instantiate');

// Custom Game Objects
const Bullet = require('../customGameObjects/Bullet');

module.exports = (Firebase) => ({
    components: {
        NetworkPlayers: {
            PLAYER_LIMIT: 10,
            BaseGameObject: Bullet,
            init: function(go) {
                var getNetBullet = function(data) {
                    var val = data.val();
                    var position = val.transform.position;
                    var scale = val.transform.scale;
                    var rotation = val.transform.rotation;

                    Instantiate(this.BaseGameObject, "Bullet" + data.key, go, {
                      transform: {
                          position: new THREE.Vector3(position.x, position.y, position.z),
                          rotation: new THREE.Euler(rotation.x, rotation.y, rotation.z),
                          scale: new THREE.Vector3(scale.x, scale.y, scale.z)
                      },
                      networkId: data.key,
                      Firebase: Firebase
                    });
                }.bind(this);


                Firebase.database.ref("bullets").limitToLast(10).on('child_added', getNetBullet);
            }
        }
    }
});
