uniform vec3 uMaterialColor;

uniform vec3 uDirLightPos;
uniform vec3 uDirLightColor;

uniform float uKd;
uniform float uBorder1;
uniform float uBorder2;

varying vec3 vNormal;
varying vec3 vViewPosition;
uniform float uTime;

float moduloTorto(float a, float b) {
	return a - floor(a / b) * b;
}

float colorStuff(float x) {
	return sin(0.1*x + 0.1 * uTime) * 0.5 + 1.0;
}

void main() {
	// compute direction to light
	vec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );
	vec3 lVector = normalize( lDirection.xyz );

	// diffuse: N * L. Normal must be normalized, since it's interpolated.
	vec3 normal = normalize( vNormal );

	// Student: check the diffuse dot product against uBorder and adjust
	// this diffuse value accordingly.
	float diffuse = max( dot( normal, lVector ), 0.0);
  diffuse = diffuse > uBorder1 ?  0.9 : diffuse > uBorder2 ? 0.8 : 0.7;

	gl_FragColor = vec4( uKd * vec3(colorStuff(vViewPosition.x), colorStuff(vViewPosition.y), colorStuff(vViewPosition.z)) * uDirLightColor * diffuse, 1.0 );
}
