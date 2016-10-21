uniform float uTime;
uniform vec3 uColor;

void main() {
	float c = (sin(uTime * 1.0) + 1.0)*0.25 + 0.5;
	gl_FragColor = vec4(uColor*c, 1.0);
}
