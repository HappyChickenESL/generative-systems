export const superSimpleShader = `

varying vec2 vUv;
uniform sampler2D uTexture;

void main()
{
    vec4 tex = texture2D(uTexture, vUv);

    gl_FragColor = tex;
}`;

// export const superSimpleShader = `

// varying vec2 vUv;
// uniform sampler2D uTexture;

// void main()
// {
//     vec4 tex = texture2D(uTexture, vUv);

//      vec3 color = tex.rgb;

//     color.r *= 1.0;
//     color.g *= 1.0;
//     color.b *= 1.0;

//     gl_FragColor = vec4(color, 1.0);
// }`;
