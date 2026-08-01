import { baseFragmentShader } from "./default";

export const halftoneFragmentShader =
  baseFragmentShader +
  `

void main()
{
    if(uHasHands < 0.5)
        discard;

    if(!insideQuad(vUv))
        discard;


    vec2 cell =
        fract(vUv * 40.0) - 0.5;


    float dot =
        smoothstep(
            0.25,
            0.05,
            length(cell)
        );


    gl_FragColor =
        vec4(
            vec3(1.0),
            dot
        );
}
`;
