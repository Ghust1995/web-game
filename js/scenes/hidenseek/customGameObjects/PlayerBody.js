const THREE = require('three');

// Core components
const MeshComponent = require('my-engine/components/Mesh');

module.exports = () => ({
  children: {
    Body: {
      components: {
        Mesh: MeshComponent({
            type: THREE.SphereGeometry,
            params: [20, 32, 32]
          },
          {
            type: THREE.MeshPhongMaterial,
            params: {
              color: Math.random() * 0xFFFFFF
            }
          }
        ),
      }
    },
    Sword: {
        transform: {
            position: new THREE.Vector3(-20, 0, -30),
            rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
            Mesh: MeshComponent({
                type: THREE.CylinderGeometry,
                params: [1, 5, 60]
            }, {
                type: THREE.MeshPhongMaterial,
                params: {
                    color: 0xFFFFFF
                }
            }),
        },
    },
    Shield: {
        transform: {
            position: new THREE.Vector3(20, 0, -20),
            rotation: new THREE.Euler(Math.PI / 2, 0, 0),
            scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
            Mesh: MeshComponent({
                type: THREE.CylinderGeometry,
                params: [10, 10, 5]
            }, {
                type: THREE.MeshPhongMaterial,
                params: {
                    color: 0xFFFFFF
                }
            }),
        },
    },
    Head: {
        transform: {
            position: new THREE.Vector3(0, 30, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1)
        },
        components: {
            Mesh: MeshComponent({
                type: THREE.SphereGeometry,
                params: [10, 32, 32]
            }, {
                type: THREE.MeshPhongMaterial,
                params: {
                    color: Math.random() * 0xFFFFFF
                }
            }),
        },
    },
  }
});
