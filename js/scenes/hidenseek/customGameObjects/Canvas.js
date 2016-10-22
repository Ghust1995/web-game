const THREE = require('three');

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
                    }
                },
                fragmentShader: Assets.canvasShader
            }
        }),
        PlaneMesh: {
            init: function(go) {
              EventBroker.subscribe("hitwall", (args) => {
                if((go.transform.position.x == -500 && args.position.x <= -500) ||
                   (go.transform.position.x == 500 && args.position.x >= 500)   ||
                   (go.transform.position.z == -500 && args.position.z <= -500) ||
                   (go.transform.position.z == 500 && args.position.z >= 500))
                  go.components.Mesh.material.uniforms.uColor.value = args.color;
              });
            },
            update: function(go, deltaTime) {
              go.components.Mesh.material.uniforms.uTime.value += deltaTime;

            }
        }
    }
});
