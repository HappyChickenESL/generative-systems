import { createRoute } from "@tanstack/react-router";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector2 } from "three";
import { rootRoute } from "./main";

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

const vertexShader = `
void main() {
    gl_Position = vec4( position, 1 );
}
`;

const Test = () => {
  return (
    <div>
      <div>das steht oben</div>
      <div>
        <Canvas>
          <ActualShader></ActualShader>
        </Canvas>
      </div>
    </div>
  );
};

const ActualShader = () => {
  const shaderRef = useRef<any>(null!);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new Vector2(1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    if (shaderRef.current) {
      const { width, height } = state.size;
      const dpr = state.viewport.dpr;

      shaderRef.current.uniforms.u_time.value = state.clock.elapsedTime;
      shaderRef.current.uniforms.u_resolution.value.set(
        width * dpr,
        height * dpr,
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={shader1}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export const testRoute = createRoute({
  component: Test,
  path: "/test",
  getParentRoute: () => rootRoute,
});
