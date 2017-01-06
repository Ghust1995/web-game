const THREE = require("three");

// Engine modules
const EventBroker = require('my-engine/core/EventBroker');

// Editor modules
//const EditableComponent = require('../../../../my-engine-editor/core/EditableComponent');

module.exports = (resolution) => ({
    texSplatMap: null,
    splatMap: new Uint8Array(resolution * resolution * 4),
    hits: 0,
    hitRadius: 30,
    init: function(go) {
        for (let i = 0; i < resolution * resolution; i++) {
            this.splatMap[i * 4 + 0] = 255;
            this.splatMap[i * 4 + 1] = 255;
            this.splatMap[i * 4 + 2] = 255;
            this.splatMap[i * 4 + 3] = 255;
        }

        EventBroker.subscribe("hitwall", (hitInfo) => {
            var hitRelPosX = 0;
            var hitRelPosY = resolution - Math.floor(resolution*((go.transform.position.y - hitInfo.position.y) + 500)/1000);

            if (go.transform.position.x == -500 && hitInfo.position.x <= -500) {
              hitRelPosX = Math.floor(resolution*((go.transform.position.z - hitInfo.position.z) + 500)/1000);
            }
            else if(go.transform.position.x == 500 && hitInfo.position.x >= 500) {
              hitRelPosX = resolution - Math.floor(resolution*((go.transform.position.z - hitInfo.position.z) + 500)/1000);
            }
            else if(go.transform.position.z == -500 && hitInfo.position.z <= -500) {
              hitRelPosX = resolution - Math.floor(resolution*((go.transform.position.x - hitInfo.position.x) + 500)/1000);
            }
            else if (go.transform.position.z == 500 && hitInfo.position.z >= 500) {
              hitRelPosX = Math.floor(resolution*((go.transform.position.x - hitInfo.position.x) + 500)/1000);
            }
            else {
              return;
            }

            //Very dump filled circle drawing
            var putpixel = function(x, y) {
              this.splatMap[(x + (resolution - 1)*y) * 4 + 0] *= hitInfo.color.r;
              this.splatMap[(x + (resolution - 1)*y) * 4 + 1] *= hitInfo.color.g;
              this.splatMap[(x + (resolution - 1)*y) * 4 + 2] *= hitInfo.color.b;
              this.splatMap[(x + (resolution - 1)*y) * 4 + 3] = 255;
            }.bind(this);

            var drawCircle = function(x0, y0, radius) {
              for(let y=-radius; y<=radius; y++)
                for(let x=-radius; x<=radius; x++)
                    if(x*x+y*y <= radius*radius)
                        putpixel(x0+x, y0+y);
            };

            drawCircle(hitRelPosX, hitRelPosY, this.hitRadius);

            this.texSplatMap.needsUpdate = true;
        });
        this.texSplatMap = new THREE.DataTexture(this.splatMap, resolution-1, resolution-1, THREE.RGBAFormat);
        this.texSplatMap.needsUpdate = true;
        go.components.Mesh.material.uniforms.uSplatMap.value = this.texSplatMap;
    },
    update: function(go, deltaTime) {
        go.components.Mesh.material.uniforms.uTime.value += deltaTime;
    }
});
