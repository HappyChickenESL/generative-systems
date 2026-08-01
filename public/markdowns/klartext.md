# Klartext

## Idee

Meine erste Idee war, dass ich die jeden Buchstaben aus dem Buchstaben selbst als kleine Partikel darstelle. Jedoch wurde so etwas ähnliches dann bereits in der Vorlesung gezeigt, weswegen ich mir was anderes ausgedacht habe. Ich habe in einem anderen Unikurs eine Aufgabe zu einem 7 Segment Display gemacht und daher kam mir die Idee, dass man die Buchstaben ja bestimmt auch über x Segmente darstellen kann. Ich habe dann herausgefunden, dass man mit 14 bzw. besser noch [16 Segmenten](https://upload.wikimedia.org/wikipedia/commons/9/95/16-segmente.png) alle Buchstaben darstellen kann. Und dann auch jedes Segment beliebig verzerren kann.

## Implementation

Zuerst habe ich mich darum gekümmert einen Buchstaben anzeigen zu können. Dafür habe ich einen Letter und ein Segment Komponenten erstellt. Ich habe dann ein Mapping, analog zu der Wiki Konvention aus dem Link oben, gemacht und mir alle Kombinationen für die Buchstaben erstellen lassen. Das habe ich dann auch direkt für Wörter gemacht. Anschließend habe ich mir Gedanken gemacht, was man ein Segment "obfuscaten" kann. Da sind mir folgende Eigenschaften eingefallen:

- Position
- Rotation
- Länge
- Ausblenden

Und diese dann unterschiedlich stark, je nachdem wie stark man den Text obfuscated haben möchte.
