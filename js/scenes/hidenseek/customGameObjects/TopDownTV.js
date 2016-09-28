const THREE = require('three');

const Engine = require('my-engine/core/Engine');
const CameraComponent = require('my-engine/components/camera');

module.exports = (transform) => ({
    transform: transform,
    components: {
        PlaneMesh: {
            init: function(go) {
                this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
                    format: THREE.RGBFormat
                });
                var TVMaterial = new THREE.MeshBasicMaterial({
                    map: this.renderTarget.texture
                });
                var TVGeometry = new THREE.PlaneGeometry(1000, 750, 1, 1);
                var TVMesh = new THREE.Mesh(TVGeometry, TVMaterial);
                go.add(TVMesh);
            },
            update: function(go/*, deltaTime*/) {
                var camChild = go.getObjectByName("Camera");
                Engine.renderer.render(Engine.hierarchy, camChild.components.Camera.ref, this.renderTarget);
            },
        },
    },
    children: {
        Camera: {
            transform: {
                position: new THREE.Vector3(0, 375, 500),
                rotation: new THREE.Euler(-Math.PI/2, 0, 0),
                scale: new THREE.Vector3(1, 1, 1)
            },
            components: {
                Camera: CameraComponent(false),
            }
        }
    }
});
