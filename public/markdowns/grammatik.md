# Grammatik

## Idee

Allgemein finde ich prozuderales Level-Design sehr interessant und gerade auch in Bezug auf gute Performance. Ich wollte unbedingt eine Stadt erstellen mit Straßen und Häusern. Jede Generation der Stadt sollte dabei komplett anders aussehen. Es hätte folgende Regeln gegeben:

- Straße malen
- nach links drehen um eine "Seitenstraße" zu malen
- nach rechts drehen um eine "Seitenstraße" zu malen
- Straße mit Gebäude auf der rechten Seite malen
- Straße mit Gebäude auf der linken Seite malen

Dabei hätten die Gebäude dann noch unterschiedliche Formen/ Höhen haben können.

## Implementation

Zuerst habe ich ein Lindenmayer-System erstellt, welches ziemlich gut funktioniert hat. Der "Roboter" hat einfache Striche gemalt und konnte damit große Straßennetze aufbauen. Anstatt eine einfach Linie zu zeichnen, habe ich als nächstes hinzugefügt, dass er ein ein Rechteck (Shape im ThreeJS/ Fiber Kontext; dann hätte man später auch eine Straßentextur draufsetzen können) ist. Der Roboter ist die Mitte der Straße abgefahren und ich musste dann sehr viel mit Offsets arbeiten. Dabei musste ich dann die Offsets anders setzen, je nachdem in welche Richtung der Roboter fährt und es war alles nicht einfach. An den "Kreuzungen" mussten dann auch nochmal extra Lösungen her.

## Update

Hab es doch noch hinbekommen den Offset richtig zu setzen. Es entsteht jetzt eine kleine Stadt mit Straßen und Häusern durch das Lindenmayer-System. Außerdem sind die Häuser per Zufall unterschiedlich hoch.
