# Unwahrscheinlich

## Idee

Die Idee hat sich aus mehreren Aspekten zusammengesetzt:

- In einem vorherigen Uni-Projekt habe ich eine Ebene mithilfe von Bernstein-Polynomen beschrieben und das sah sehr cool aus => Irgendwas mit einer Plane machen
- Simplex Noise ist eine effizientere und "natürlichere" Variante von Perlin Noise, weswegen ich sie sehr interessant fand, inbesondere wenn viel gerendered wird.
- großes Interesse für prozedurale Terrain Generation und Performance

## Implementation

Zuerst habe ich eine Plane erstellt, die das gesamte Terrain darstellt. Danach habe ich jeden Vertex auf der Ebene um einen bestimmten Wert nach oben verschoben. Dieser Wert entsteht aus der Kombination mehrerer Simplex-Noise Funktionen. Dieser Algorithmus eignet sich besonders für natürliches Terrain, da nah aneinander liegende Punkte, ähnliche Werte haben und es keine großen Sprünge gibt. Anschließend hatte ich dann eine Plane und habe noch ein paar Bäume hinzugefügt, die aus einem Cylinder und einem Cone bestehen.
