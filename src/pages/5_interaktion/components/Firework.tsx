import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, Color, Float32BufferAttribute, Points } from "three";
import { minMaxRand } from "../../../shared/utils";

type FireworkType = "sphere" | "ring" | "spiral";

type ParticleData = {
  vx: number;
  vy: number;
  color: Color;
};

type FireworkProps = {
  x: number;
  y: number;
  onDone: () => void;
};

const types: FireworkType[] = ["sphere", "ring", "spiral"];

export const Firework = ({ x, y, onDone }: FireworkProps) => {
  const props = useMemo(() => {
    const type = types[Math.floor(Math.random() * 3)];
    const count = Math.floor(minMaxRand(500, 1000));
    const lifetime = minMaxRand(1.5, 3.0);
    const speed = minMaxRand(0.4, 1.6);
    const gravity = minMaxRand(0.1, 0.5);

    const numColors = Math.floor(minMaxRand(1, 4));
    const baseHue = minMaxRand(0, 360);
    const hues: number[] = Array.from(
      { length: numColors },
      (_, i) => (baseHue + (i * 360) / numColors) % 360,
    );

    const particles: ParticleData[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const baseAngle = t * Math.PI * 2;

      const n = Math.random();

      let vx: number, vy: number;

      if (type === "sphere") {
        const angle = baseAngle + n * 1.0;
        const mag = speed * (0.6 + Math.abs(n) * 0.4);
        vx = Math.cos(angle) * mag;
        vy = Math.sin(angle) * mag;
      } else if (type === "ring") {
        const mag = speed * (0.95 + n * 0.1);
        vx = Math.cos(baseAngle) * mag;
        vy = Math.sin(baseAngle) * mag;
      } else {
        const angle = t * Math.PI * 6 + n * 0.8;
        const mag = speed * (0.3 + t * 0.7 + n * 0.15);
        vx = Math.cos(angle) * mag;
        vy = Math.sin(angle) * mag;
      }

      const hue = hues[i % hues.length];
      const color = new Color(`hsl(${hue}, 90%, 65%)`);
      particles.push({ vx, vy, color });
    }

    return { count, lifetime, gravity, particles };
  }, []);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(props.count * 3);
    const colors = new Float32Array(props.count * 3);
    for (let i = 0; i < props.count; i++) {
      const [r, g, b] = props.particles[i].color;
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geo;
  }, [props]);

  const pointsRef = useRef<Points>(null);
  const elapsed = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current || !pointsRef.current) return;

    elapsed.current += delta;
    const t = elapsed.current;
    const progress = t / props.lifetime;

    if (progress >= 1) {
      done.current = true;
      onDone();
      return;
    }

    const fade = 1 - progress;
    const geometry = pointsRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const colors = geometry.attributes.color.array;

    for (let i = 0; i < props.count; i++) {
      const { vx, vy, color } = props.particles[i];
      positions[i * 3] = vx * t;
      positions[i * 3 + 1] = vy * t - 0.5 * props.gravity * t * t;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = color.r * fade;
      colors[i * 3 + 1] = color.g * fade;
      colors[i * 3 + 2] = color.b * fade;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[x, y, 0]} geometry={geometry}>
      <pointsMaterial vertexColors size={3} />
    </points>
  );
};
