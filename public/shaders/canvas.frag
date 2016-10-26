uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uSplatMap;

//uniform vec2 uHitPositions[100];
//uniform vec3 uHitColors[100];

varying vec2 vUv;

void main() {
	float c = (sin(uTime * 1.0) + 1.0)*0.25 + 0.5;
	vec3 color = texture2D(uSplatMap, vUv).rgb;
	gl_FragColor = vec4(color*c, 1.0);
	// for(int i = 0; i < 100; i++)
	// {
	// 	if(length(vUv - uHitPositions[i]) < 0.2) {
	// 		gl_FragColor = vec4(uHitColors[i], 1.0);
	// 	}
	// }
}
