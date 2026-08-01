import { baseFragmentShader } from "./default";

export const testShader =
  baseFragmentShader +
  `
  uniform sampler2D uTexture;
uniform vec2 uResolution;

uniform float uShift;

void main()
{
    
if(uHasHands < 0.5)
        discard;


    if(!insideQuad(vUv))
        discard;
    
    // vec2 pixel = 1.0 / uResolution;


    // convert pixel shift to UV offset
    // float shift = uShift * pixel.x;


    // shift red channel left
    // float r = texture2D(
    //     uTexture,
    //     vUv - vec2(shift, 0.0)
    // ).r;


    // keep green unchanged
    // float g = texture2D(
    //     uTexture,
    //     vUv
    // ).g;


    // shift blue channel right
    // float b = texture2D(
    //     uTexture,
    //     vUv + vec2(shift, 0.0)
    // ).b;


    // vec3 color = vec3(
    //     texture2D(
    //     uTexture,
    //     vUv
    // ).r,
    //     texture2D(
    //     uTexture,
    //     vUv
    // ).g,
    //     texture2D(
    //     uTexture,
    //     vUv
    // ).b
    // );


    // emulate out[::3,:,:] *= 0.72
    // based on screen pixel row
    // float row = floor(
    //     vUv.y * uResolution.y
    // );


    // if(mod(row, 3.0) == 0.0)
    // {
    //     color *= 0.72;
    // }


    vec4 tex = texture2D(uTexture, vUv);

    gl_FragColor = vec4(
        tex.rgb,
        1.0
    );
}`;
