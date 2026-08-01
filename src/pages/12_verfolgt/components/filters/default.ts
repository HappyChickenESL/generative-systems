export const baseFragmentShader = `
varying vec2 vUv;

uniform vec2 uLeftThumb;
uniform vec2 uRightThumb;
uniform vec2 uRightIndex;
uniform vec2 uLeftIndex;

uniform float uHasHands;
uniform float uTime;

float cross2d(vec2 a, vec2 b)
{
    return a.x * b.y - a.y * b.x;
}

bool insideQuad(vec2 p)
{
    vec2 a = uLeftThumb;
    vec2 b = uRightThumb;
    vec2 c = uRightIndex;
    vec2 d = uLeftIndex;

    float ab = cross2d(b-a, p-a);
    float bc = cross2d(c-b, p-b);
    float cd = cross2d(d-c, p-c);
    float da = cross2d(a-d, p-d);

    bool positive =
        ab >= 0.0 &&
        bc >= 0.0 &&
        cd >= 0.0 &&
        da >= 0.0;

    bool negative =
        ab <= 0.0 &&
        bc <= 0.0 &&
        cd <= 0.0 &&
        da <= 0.0;

    return positive || negative;
}
`;

export const defaultFragmentShader =
  baseFragmentShader +
  `


void main()
{
    if (uHasHands < 0.5) {
        discard;
    }

    if (uLeftThumb.x <= 0.0 || uRightThumb.x <= 0.0) {
        discard;
    }

    if (!insideQuad(vUv)) {
        discard;
    }


    vec2 uv = vUv;


    float lineX =
        step(
            0.03,
            abs(fract(uv.x * 20.0) - 0.5)
        );


    float lineY =
        step(
            0.03,
            abs(fract(uv.y * 20.0) - 0.5)
        );


    float grid = max(lineX, lineY);


    // black background
    vec3 color = vec3(0.0);

    // white grid lines
    color = mix(
        color,
        vec3(1.0),
        grid
    );


    gl_FragColor = vec4(
        color,
        0.75
    );
}
`;
