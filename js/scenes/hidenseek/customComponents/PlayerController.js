// Engine modules
const Input = require('my-engine/core/Input');

// Editor modules
const EditableComponent = require('../../../../my-engine-editor/core/EditableComponent');


module.exports = EditableComponent("PlayerController", () => ({
    linSpeed: 80,
    angSpeed: 4,
    update: function(go, deltaTime) {
        var vert = (Input.isDown(Input.Keys.W) ? 1 : 0) + (Input.isDown(Input.Keys.S) ? -1 : 0);
        var velocity = go.transform.getForward().multiplyScalar(this.linSpeed * vert * deltaTime);

        var horz = (Input.isDown(Input.Keys.D) ? 1 : 0) + (Input.isDown(Input.Keys.A) ? -1 : 0);
        velocity.add(go.transform.getRight().multiplyScalar(this.linSpeed * horz * deltaTime));

        go.transform.position.add(velocity);
    }
}));
