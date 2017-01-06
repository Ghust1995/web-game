const THREE = require('three');
//const _ = require('lodash');

// Components
const MeshComponent = require('my-engine/components/Mesh');

const CirclePaintCanvasComponent = require('../customComponents/CirclePaintCanvas');

const resolution = 1024;

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
        CirclePaintCanvas: CirclePaintCanvasComponent(resolution),
    }
});
