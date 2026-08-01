import { baseFragmentShader } from "./default";

export const waveFragmentShader =
  baseFragmentShader +
  `

void main()
{
    if(uHasHands < 0.5)
        discard;


    if(!insideQuad(vUv))
        discard;


    vec2 uv=vUv;


    uv.x += sin(
        uv.y*30.0 + uTime
    )*0.02;


    float grid =
        max(
            step(abs(fract(uv.x*20.0)-0.5),0.03),
            step(abs(fract(uv.y*20.0)-0.5),0.03)
        );


    gl_FragColor =
        vec4(
            vec3(1.0),
            grid
        );
}
`;
