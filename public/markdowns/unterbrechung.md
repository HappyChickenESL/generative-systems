# Unterbrechung

## Idee

Ich fand Conways Game of Life sehr interessant und wollte deswegen wahrscheinlich einen zellulären Automaten machen. Boids fand ich auch interessant, jedoch wurde das in der Vorlesung bereits von einer anderen Person vorgestellt.

Das Theme mit einem Wald und Waldbrand kam mir tatsächlich durch die aktuellen Gegebenheiten in Europa. Ich hatte dabei zwei Ideen, was die Unterbrechung darstellt:

- Man setzt ein Feuer und das Feuer verbreitet sich
- Feuer entsteht zufällig und man löscht es mit Wasser

Schließlich hab ich mich für ersteres entschieden.

## Implementation

Zelluläre Automaten machen aus, dass sich jedes Feld nur die Nachbarfelder anguckt und sich so lokal beeinflußen lässt aber nicht global. Ich habe also damit angefangen ein grid aus Feldern zu erstellen und mir anschließend die verschiedenen States ausgedacht.

- Empty: Hier kann ein Baum wachsen, wenn ein Baum ein direkter Nachbar ist
- Tree: Hier ist ein Baum, der anfangen kann zu brennen, wenn Feuer ein direkter Nachbar ist
- Burning: Hier brennt ein Baum, geht nach x Ticks in den nächsten State
- Burned: Dieser State kann zu Empty werden, wenn ein Baum ein direkter Nachbar ist

Jeden Tick werden dann alle Felder geupdated, wenn es einen geeigneten Nachbarn hat und die Zufallszahl größer als der Threshold war.
