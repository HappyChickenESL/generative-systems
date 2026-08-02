# Tiles

## Idee

Meine erste Idee war das Erstellen eines Puzzles. Ich habe zwei Nichten, die gerne puzzlen und dachte mir, dass ich das in diesem Teilprojekt vielleicht unterbringen könnte. Jedoch ist mir dann relativ schnell aufgefallen, dass es weder generativ ist => immer der selbe Ablauf/ Ergebnis abhängig vom Input, noch einen klassichen tiling-Algorithmus benutzt. Es könnte für den Aspekt vielleicht als Hack durchgehen, da es mit Tiles zutun hat (was ja die einzelnen Puzzle Stücke sind) und auch mit dem Zusammensetzen zu tun hat wie die Algorithmen, z.B. wfc. Ich wollte das Puzzle jeder so oder so umsetzen und hatte mich dann erstmal dafür entschieden.

## Implementation

Besonders schwierig bei der Aufgabe war das State-Management von bereits aneinander hängenden Tiles. Wenn ich ein Puzzle Stück anklicke, welches mit einem anderen verbunden ist, müssen sich beide bewegen und auch die Regeln von beiden gelten. Dabei dann auch in jede Richtung zu gucken welches Puzzle Stück nah dran ist und ob sie aneinander passen.

## Fazit

Ich wollte eigentlich wave function collapse noch umsetzen, jedoch hatte ich riesen Performance Probleme. Selbst ohne backtracking/ back propagation, hat das Bestimmen und Anzeigen von den Positionen für ein 4x4 Grid 30 Sekunden gedauert und oft ist der Browser sogar abgestürzt. Mein Code hatte also scheinbar ein Memory Leak oder ähnliches. Ich hatte das Gefühl, dass es mit den ThreeJS DataTextures für das BasicMeshMaterial zu tun hatte aber konnte es mir nicht erklären. Insbesondere da ich React Rerendering/ Lifecycle sehr gut verstehe.

Aufgabe ist also nicht wirklich erfüllt aber das Puzzle ist trotzdem cool :)
