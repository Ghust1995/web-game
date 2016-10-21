const THREE = require('three');

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
            update: function(go, deltaTime) {
              go.components.Mesh.material.uniforms.uTime.value += deltaTime;
            }
        }
    }
});
