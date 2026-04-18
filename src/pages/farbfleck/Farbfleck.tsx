import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

const shader1 = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}
`;

const Farbfleck = () => {
  const shaderRef = useRef<any>(null!);

  return (
    <div>
      <div>das steht oben</div>
      <div>
        {/* <Canvas>
            <mesh>
              <shaderMaterial
                ref={shaderRef}
                fragmentShader={shader1}
              ></shaderMaterial>
            </mesh>
          </Canvas> */}
        <Canvas>
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <shaderMaterial
              ref={shaderRef}
              fragmentShader={shader1}
            ></shaderMaterial>
            <meshPhongMaterial />
          </mesh>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />
        </Canvas>
      </div>
    </div>
  );
};

export const farbfleckRoute = createRoute({
  component: Farbfleck,
  path: "/farbfleck",
  getParentRoute: () => rootRoute,
});
