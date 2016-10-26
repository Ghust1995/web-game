const THREE = require('three');
const _ = require('lodash');

// Engine modules
const EventBroker = require('my-engine/core/EventBroker');

// Components
const MeshComponent = require('my-engine/components/Mesh');

module.exports = (Assets, initialColor, transform) => ({
    transform: transform,
    components: {
        Mesh: MeshComponent({
            type: THREE.PlaneGeometry,
            params: [1000, 1000, 10, 10]
        }, {
            type: THREE.ShaderMaterial,
            params: {
                uniforms: {
                    uTime: {
                        value: 1.0
                    },
                    uColor: {
                        value: initialColor
                    },
                    uSplatMap: {
                        type: 't',
                        value: new THREE.Texture()
                    },
                    // uHitPositions: {
                    //     type: "v2v",
                    //     value: _.fill(new Array(100), new THREE.Vector2(0, 0), 0, 100)
                    // },
                    // uHitColors: {
                    //     type: "v3v",
                    //     value: _.fill(new Array(100), new THREE.Vector3(1, 0, 1), 0, 100)
                    // }
                },
                fragmentShader: Assets.canvasFragShader,
                vertexShader: Assets.canvasVertShader
            }
        }),
        PlaneMesh: {
            texSplatMap: null,
            splatMap: new Uint8Array(256 * 256 * 4),
            hits: 0,
            init: function(go) {
                for (let i = 0; i < 256 * 256; i++) {
                    this.splatMap[i * 4 + 0] = 255;
                    this.splatMap[i * 4 + 1] = 255;
                    this.splatMap[i * 4 + 2] = 255;
                    this.splatMap[i * 4 + 3] = 255;
                }

                EventBroker.subscribe("hitwall", (hitInfo) => {
                    var hitRelPosX = 0;
                    var hitRelPosY = 256 - Math.floor(256*((go.transform.position.y - hitInfo.position.y) + 500)/1000);

                    if (go.transform.position.x == -500 && hitInfo.position.x <= -500) {
                      hitRelPosX = Math.floor(256*((go.transform.position.z - hitInfo.position.z) + 500)/1000);
                    }
                    else if(go.transform.position.x == 500 && hitInfo.position.x >= 500) {
                      hitRelPosX = 256 - Math.floor(256*((go.transform.position.z - hitInfo.position.z) + 500)/1000);
                    }
                    else if(go.transform.position.z == -500 && hitInfo.position.z <= -500) {
                      hitRelPosX = 256 - Math.floor(256*((go.transform.position.x - hitInfo.position.x) + 500)/1000);
                    }
                    else if (go.transform.position.z == 500 && hitInfo.position.z >= 500) {
                      hitRelPosX = Math.floor(256*((go.transform.position.x - hitInfo.position.x) + 500)/1000);
                    }
                    else {
                      return;
                    }

                    for (let i = (hitRelPosX - 10); i < (hitRelPosX + 10); i++) {
                      for (let j = (hitRelPosY - 10); j < (hitRelPosY + 10); j++) {
                        this.splatMap[(i + 255*j) * 4 + 0] = hitInfo.color.r * 255;
                        this.splatMap[(i + 255*j) * 4 + 1] = hitInfo.color.g * 255;
                        this.splatMap[(i + 255*j) * 4 + 2] = hitInfo.color.b * 255;
                        this.splatMap[(i + 255*j) * 4 + 3] = 255;
                      }
                    }
                    this.texSplatMap.needsUpdate = true;
                });
                this.texSplatMap = new THREE.DataTexture(this.splatMap, 255, 255, THREE.RGBAFormat);
                this.texSplatMap.needsUpdate = true;
                go.components.Mesh.material.uniforms.uSplatMap.value = this.texSplatMap;
            },
            update: function(go, deltaTime) {
                go.components.Mesh.material.uniforms.uTime.value += deltaTime;
            }
        }
    }
});
