import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../main";
import { Canvas } from "@react-three/fiber";
import type { JSX } from "react";
import { Splash3 } from "./components/Splash3";
import { OrbitControls } from "@react-three/drei";

const colorShader = `
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
  const arr: JSX.Element[] = [];

  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  for (let i = 0; i < 1000; i++) {
    arr.push(
      <Splash3
        key={i}
        x={rand(-10, 10)}
        y={rand(-10, 10)}
        z={rand(-10, 10)}
        size={1}
      ></Splash3>,
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <OrbitControls></OrbitControls>
      <ambientLight />
      {arr}
    </Canvas>
  );
};

export const farbfleckRoute = createRoute({
  component: Farbfleck,
  path: "/farbfleck",
  getParentRoute: () => rootRoute,
});
