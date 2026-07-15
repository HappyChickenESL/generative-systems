import { Line } from "@react-three/drei";

export function Roads({ segments }: { segments: any[] }) {
  console.log(segments);
  return (
    <>
      {segments.map((seg, i) => (
        <Line
          key={i}
          points={[seg.start, seg.end]}
          color="white"
          lineWidth={1}
        />
      ))}
    </>
  );
}
