uniform float uTime;
uniform vec3 uVelocity;
uniform vec3 uRotationCenter;

varying vec3 vNormal;
varying vec3 vViewPosition;

float NiceThing(float x, vec3 n) {
	return dot(n, vec3(1.0, 1.0, 1.0)) < 0.0 ? 1.5 * cos(0.5 * (0.2 * x + 0.1*uTime)) * sin(0.2 * x + uTime) : 1.5 * sin(0.5 * (0.2 * x + 0.1*uTime))* cos(0.4 * x + uTime);
}

vec3 makeCoolRotation(vec3 pos, vec3 direction) {
	vec3 v = pos;
	vec3 axis = normalize(direction);

	vec3 distV = v - uRotationCenter - (axis * dot(v - uRotationCenter, axis));
	float dist = length(distV);
	vec3 normV = normalize(cross(distV, axis));
	float angle = 0.04 * dist * sin(0.5*uTime);
	float radius = 2.0 +  sin(uTime);
	v += radius*(distV * cos(angle) + normV * dist * sin(angle)) - distV;
	return v;
}

vec3 makeParabolaMovement(vec3 pos, vec3 direction) {
	vec3 v = pos;
	float dist = length(v - uRotationCenter);

	v -= 0.000005* dist*dist*direction;
	return v;
}

void main() {
	vec3 v = position;
	vec3 n = normal;

	v.x += NiceThing(v.x, n);
	v.y += NiceThing(v.y, n);
	v.z += NiceThing(v.z, n);

	//v = makeCoolRotation(v, vec3(0.0, 1.0, 1.0));
	v = makeParabolaMovement(v, uVelocity);

	vec4 v2 = vec4(v, 1.0);
	//n.x += NiceSin(n.x);
	//n.y += NiceSin(n.y);
	//n.z += NiceSin(n.z);


	vNormal = normalize( normalMatrix * n );
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = -mvPosition.xyz;
	gl_Position = projectionMatrix * modelViewMatrix * v2;

}
