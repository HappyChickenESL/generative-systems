import { baseFragmentShader } from "./default";

export const edgeShader =
  baseFragmentShader +
  `
uniform sampler2D uTexture;
uniform vec2 uResolution;

float brightness(vec3 color)
{
    return dot(
        color,
        vec3(0.299, 0.587, 0.114)
    );
}


void main()
{
    if(uHasHands < 0.5)
        discard;


    if(!insideQuad(vUv))
        discard;


    vec2 pixel = 1.0 / uResolution;


    float tl = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(-1.0,-1.0)
        ).rgb
    );

    float t = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(0.0,-1.0)
        ).rgb
    );

    float tr = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(1.0,-1.0)
        ).rgb
    );


    float l = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(-1.0,0.0)
        ).rgb
    );

    float r = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(1.0,0.0)
        ).rgb
    );


    float bl = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(-1.0,1.0)
        ).rgb
    );

    float b = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(0.0,1.0)
        ).rgb
    );

    float br = brightness(
        texture2D(
            uTexture,
            vUv + pixel * vec2(1.0,1.0)
        ).rgb
    );


    // Sobel operator
    float gx =
        -tl - 2.0*l - bl
        + tr + 2.0*r + br;


    float gy =
        -tl - 2.0*t - tr
        + bl + 2.0*b + br;


    float edge =
        length(vec2(gx,gy));


    edge = smoothstep(
        0.2,
        0.8,
        edge
    );


    gl_FragColor = vec4(
        vec3(edge),
        edge
    );
}
`;
