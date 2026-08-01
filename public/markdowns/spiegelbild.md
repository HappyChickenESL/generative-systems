# Spiegelbild

## Idee

Ich hatte die Idee bereits vor einigen Wochen. Also, dass ich durch Bereiche des originalen Bildes dithern möchte. Jedoch hat sich die Idee im Laufe der Implementation nochmal ziemlich verändert.

Idee vom Ablauf

- Bild ganz normal dithern => Pixel für Pixel durchgehen und wenn Helligkeit > 128 => weiß, sonst schwarz
- Per Zufall: Bereich auswähl, der 20% der Originalgröße des Bildes sind.
- Wenn Bereich z.B. unter Helligkeit 80 => dark threshold image; Helligkeit über 170 => bright threshold image; sonst => weiter suchen
- Für jedes x-te Pixel in dem Original Dither Bild entweder dark oder bright image platzieren abhängig davon ob pixel weiß oder schwarz ist

Das hat für mein eines ausgewähltes Bild auch sehr gut funktioniert, jedoch für andere Bilder so gar nicht. Viele Bilder hatten keine Bereiche, die so hell/ dunkel waren und daher war es schon mal stark limitiert und es kamen noch andere Probleme hinzu.

## Implementation

Jetzt der tatsächliche Ablauf

- Bild ganz normal dithern mit threshold 128
- Bild etwas "aggressiver" dithern für das dunkle Bild
- Dunkles Bild invertieren und als helles Bild benutzen
- Jedes x-te Pixel entweder durch helles oder dunkles Bild tauschen
- Bilder zufällig um bis zu 360° drehen
