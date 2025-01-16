# MyTurnier
## Funktionen
Das Addon zeigt auf den Seiten der Turnierkalender von [mytischtennis.de](https://www.mytischtennis.de/) und [click-tt.de](https://dttb.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/home) eine interaktive
Karte hinzu, die die Turniere der Seite anzeigt.

<img src="https://github.com/user-attachments/assets/e90bdb63-3811-4aae-ab1c-379759aceef0" alt="drawing" width="300"/>

Vom Addon generierte Karte auf [ttvn.click-tt.de](https://ttvn.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/tournamentCalendar?federation=TTVN)

### Einstellungen

<img src="https://github.com/user-attachments/assets/9d044d3c-8eaa-4c43-a554-7f9453774022" alt="drawing" width="300"/>

Vom Addon generierte Karte auf [mytischtennis.de](https://www.mytischtennis.de/clicktt/TTVN/turnierkalender/). Im Gegensatz zu click-tt, werden hier auch Races gelistet und
dementsprechend auf der Karte angezeigt. Falls man nur Races sehen, die Races ausgeblenden oder offzielle Turniere, wie z.B. Meisterschaften, ausgeblenden möchte, gibt es
dazu die passenden Einstellungen.

## Installation
### Firefox
Folge diesem Link, um auf die [Mozilla-Addons-Seite](https://addons.mozilla.org/de/firefox/addon/myturnierextension/) des Addons zu gelangen und klicke anschließend auf "Zu Firefox
hinzufügen". Bestätige ggf. deinen Prozess und klicke oben rechts im Popup erneut auf "Hinzufügen".
### Chrome
Lade die [.zip-Datei](https://github.com/ferdithedev/MyTurnier/releases/download/1.0/MyTurnier.zip) des Addons herunter. Öffne anschließend, im Chrome Browser, die Seite `chrome://extensions/` und füge das
Addon hinzu, indem du die heruntergeladene .zip-Datei in das Fenster ziehst.

## Funktionsweise
Die Karte wird mit [Leaflet](https://leafletjs.com/) und [OpenStreetMap](https://www.openstreetmap.org/) erzeugt. Um die Koordinaten der Orte zu erhalten wird die API [photon von komoot](https://photon.komoot.io/)
verwendet, die ebenfalls mit OpenStreetMap funktioniert.
Die Daten ließt das Addon aus den jweiligen Tabellen der Seiten ein und extrahiert anschließend die relevanten Informationen.
