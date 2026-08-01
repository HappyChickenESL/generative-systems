# Verfolgt

## Idee

Ich hatte ein Video auf Instagram zu einem Overlay gesehen, welches man mit den Hängen steuern kann ([Insta-Reel](https://www.instagram.com/reels/DbXMQhmNjx0/)). Das war eigentlich meine Hauptinspiration. Insbesondere, weil ich auch nochmal etwas mehr mit Shadern ausprobieren wollte und das eine gute Möglichkeit ist verschiedene Sachen auszuprobieren.

## Implementation

Ich hatte bei dieser Aufgabe einige Probleme. Erstens war es sehr schwierig die Verbindung zwischen MatterJs und der Kamera über React herzustellen. Ich hatte einige Probleme damit, dass entweder die Kamera noch nicht bereit war, oder das tensorflow Modell, welches unterhalb von MatterJs liegt und benutzt wird. Jedoch hatte ich das dann irgendwann am laufen und konnte mir die Handpositionen etc holen. Mit Hilfe eines Fragment Shaders und eines Shader Materials konnte ich dann ziemlich einfach den Bereich über ein overlay mit alpha Kanal Wert anpassen.

Das nächste Problem war dann jedoch bei dem Laden der Textur von dem Webcam Video und das schicken dieser an die Grafikkarte. Ich habs bisher immer noch nicht hinbekommen und das stört mich sehr. Deshalb konnte ich die meisten coolen Shader, die ich vor hatte, gar nicht realisieren...
