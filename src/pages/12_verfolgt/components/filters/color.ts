import { baseFragmentShader } from "./default";

export const colorShiftFragmentShader =
  baseFragmentShader +
  `
  uniform vec3 uColor;
  uniform sampler2D uTexture;
void main()
{
if(uHasHands < 0.5)
        discard;


    if(!insideQuad(vUv))
        discard;
    vec4 tex = texture2D(uTexture, vUv);

    vec3 tinted = tex.rgb * uColor;

    gl_FragColor = vec4(
        tinted,
        0.7
    );
}`;
