uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D normalMap;
uniform float globalTime;
uniform vec3 lightSource;
uniform float lightZ;
uniform float ambientLight;

void main()
{
  vec2 pos = gl_FragCoord.xy / resolution.xy;
  vec3 color = texture2D(texture, pos).xyz;

  float distToLight = distance(gl_FragCoord.xy, lightSource.xy);
  float lightRadius = lightSource.z * resolution.x;

  //Getting current pixel normal
  vec3 normalVector = texture2D(normalMap, pos).xyz - vec3(0.5, 0.5, 0);

  // Light pos
  vec3 lightVector = vec3(lightSource.x - gl_FragCoord.x, lightSource.y - gl_FragCoord.y, lightZ);

  // Normalizing
  normalVector = normalize(normalVector);
  lightVector = normalize(lightVector);

  // Calculate angle
  float diffuse = max(dot(normalVector, lightVector), 0.0);

  // Cell shading

  float ToonThresholds[4];
  ToonThresholds[0] = 0.95;
  ToonThresholds[1] = 0.5;
  ToonThresholds[2] = 0.2;
  ToonThresholds[3] = 0.03;

  float ToonBrightnessLevels[5];
  ToonBrightnessLevels[0] = 1.0;
  ToonBrightnessLevels[1] = 0.8;
  ToonBrightnessLevels[2] = 0.6;
  ToonBrightnessLevels[3] = 0.35;
  ToonBrightnessLevels[4] = 0.2;

  // put distance into consideration;
  float distanceFactor = max((1.0 - distToLight/lightRadius), ambientLight);

  color = color * diffuse * (distanceFactor + vec3(ambientLight));

  // if (diffuse > ToonThresholds[0])
  // {
  //     color *= ToonBrightnessLevels[0];
  // }
  // else if (diffuse > ToonThresholds[1])
  // {
  //     color *= ToonBrightnessLevels[1];
  // }
  // else if (diffuse > ToonThresholds[2])
  // {
  //     color *= ToonBrightnessLevels[2];
  // }
  // else if (diffuse > ToonThresholds[3])
  // {
  //     color *= ToonBrightnessLevels[3];
  // }
  // else
  // {
  //     color *= ToonBrightnessLevels[4];
  // }

  gl_FragColor = vec4(color, 1.0);
}
