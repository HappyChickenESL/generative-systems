import { Canvas, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useHandStore } from "../hand.store";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { defaultFragmentShader } from "./filters/default";
import { halftoneFragmentShader } from "./filters/classic";
import { waveFragmentShader } from "./filters/wave";
import { noiseFragmentShader } from "./filters/noise";
import { useWebcamStore } from "../webcam.store";
import { colorShiftFragmentShader } from "./filters/color";
import { testShader } from "./filters/test";
import { superSimpleShader } from "./filters/video";

const fragmentShaders = [
  defaultFragmentShader,
  halftoneFragmentShader,
  waveFragmentShader,
  noiseFragmentShader,
  colorShiftFragmentShader,
  testShader,
  superSimpleShader,
];

function GridMesh({ shaderIndex }: { shaderIndex: number }) {
  const material = useRef<any>(null);

  const HandGridMaterial = useMemo(
    () =>
      shaderMaterial(
        {
          uLeftThumb: new THREE.Vector2(),
          uRightThumb: new THREE.Vector2(),
          uLeftIndex: new THREE.Vector2(),
          uRightIndex: new THREE.Vector2(),
          uHasHands: 0,
          uTime: 0,
          uColor: new THREE.Vector3(1.0, 0.3, 0.3),

          uShift: 6,
          uTexture: null,
          uResolution: new THREE.Vector2(640, 480),
        },

        `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
  `,
        fragmentShaders[
          ((shaderIndex % fragmentShaders.length) + fragmentShaders.length) %
            fragmentShaders.length
        ],
      ),
    [shaderIndex],
  );

  const leftHand = useHandStore((s) => s.leftHand);
  const rightHand = useHandStore((s) => s.rightHand);

  const video = useWebcamStore((s) => s.video);

  useFrame(({ clock }) => {
    if (!material.current) return;

    material.current.uniforms.uTime.value = clock.elapsedTime;

    const lt = leftHand.thumbTip;
    const rt = rightHand.thumbTip;
    const li = leftHand.indexTip;
    const ri = rightHand.indexTip;

    if (!lt || !rt || !li || !ri) {
      material.current.uniforms.uHasHands.value = 0;
      return;
    }

    const videoTexture = new THREE.VideoTexture(video);

    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    material.current.uniforms.uTexture = videoTexture;

    material.current.uniforms.uLeftThumb.value.set(lt.x / 640, 1 - lt.y / 480);

    material.current.uniforms.uRightThumb.value.set(rt.x / 640, 1 - rt.y / 480);

    material.current.uniforms.uLeftIndex.value.set(li.x / 640, 1 - li.y / 480);

    material.current.uniforms.uRightIndex.value.set(ri.x / 640, 1 - ri.y / 480);
    material.current.uniforms.uHasHands.value = 1;
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[640, 480]} />

      <primitive transparent ref={material} object={new HandGridMaterial()} />
    </mesh>
  );
}

export const HandGrid = ({ shaderIndex }: { shaderIndex: number }) => {
  return (
    <Canvas
      gl={{ alpha: true }}
      orthographic
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      camera={{
        position: [0, 0, 1],
        zoom: 1,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 640,
        height: 480,
      }}
    >
      <GridMesh shaderIndex={shaderIndex} />
    </Canvas>
  );
};
