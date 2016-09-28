const THREE = require('three');


module.exports = () => ({
  isHit: false,
  wasHit:false,
  init: function (go) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.font = "Bold 20px Arial";
    this.context.fillStyle = "rgba(0,0,0,0.95)";

    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: this.texture } );

    this.sprite = new THREE.Sprite( spriteMaterial );
    this.sprite.scale.set(200,100,1.0);
    this.sprite.position.set( 0, 0, 0 );
    go.add( this.sprite );
  },
  update: function (go, deltaTime) {
    if(!this.isHit && this.wasHit) {
      this.context.clearRect(0,0,300,300);
      this.texture.needsUpdate = true;
    }
    this.wasHit = this.isHit;
    this.isHit = false;
  },
  onHitScan: function (go) {
    if ( !this.isHit && !this.wasHit ){
      this.context.clearRect(0,0,640,480);
      var message = go.name;
      var metrics = this.context.measureText(message);
      var width = metrics.width;
      this.context.fillStyle = "rgba(0,0,0,0.95)"; // black border
      this.context.fillRect( 0,0, width+8,20+8);
      this.context.fillStyle = "rgba(255,255,255,0.95)"; // white filler
      this.context.fillRect( 2,2, width+4,20+4 );
      this.context.fillStyle = "rgba(0,0,0,1)"; // text color
      this.context.fillText( message, 4,20 );
      this.texture.needsUpdate = true;
    }
    this.isHit = true;
  }
});
