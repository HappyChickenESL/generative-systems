import { baseFragmentShader } from "./default";

export const noiseFragmentShader =
  baseFragmentShader +
  `


float random(vec2 st)
{
    return fract(
        sin(dot(st.xy,
        vec2(12.9898,78.233)))
        *43758.5453
    );
}


void main()
{
    if(uHasHands < 0.5)
        discard;


    if(!insideQuad(vUv))
        discard;


    float n =
        random(
            floor(vUv*200.0)
        );


    gl_FragColor =
        vec4(
            vec3(n),
            n
        );
}
`;
