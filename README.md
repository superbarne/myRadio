# Einleitung
myRadio ist ein Webclient zum Abspielen von WebRadio LiveStreams. Aus einer im Web verfügbaren
Liste können Sender angezeigt, gewählt und abgespielt werden.
Auswahlkriterien wie Region oder Genre erlauben es, spezifische Listen zu erzeugen.
Eine Anmeldung per Nickname ermöglicht eine permanente Speicherung persönlicher Favoriten-Listen.
Diese persönlichen Daten können mit anderen Webclients synchronisiert werden,
wobei ein Websocket Broadcast Server zur Kommunikation verwendet wird.
# Funktionsanforderungen
## Allgemeine Anforderungen
- myRadio soll als single-page Anwendung erstellt werden.
- Ansichten für die verschiedenen Operationen und Optionen sollen bei Bedarf
dynamisch ein- und ausgeblendet werden.
- Die Bedienung des Systems soll einfach sein, sodass eine Verwendung ohne weitere
Anleitung möglich ist.
- Alle Operationen sollen mit Maus und Tastatur ausführbar sein.
- Es soll keine unterschiedliche Clientsoftware entwickelt werden. Alle Clients eines Typs
sollen identische Software verwenden.
- Eine Anwendungsinstanz dieses Programms (ein Client) soll über einen WebsocketBroadcast-Server
mit Clients des eigenenTyps kommunizieren können.
## Registrierung und Anmeldung
- Eine Registrierung per Nickname und Kennwort soll möglich sein.
- Registrierte BenutzerInnen sollen sich am Client anmelden und abmelden können.
- Jeder Client soll die Registrierungsdaten persistent speichern und mit den Daten der
Clients des eigenen Typs synchronisieren.
## Senderwahl
- Es soll eine im Web öffentlich verfügbare Senderliste verwendet werden (s. Kap. 2.8).
- Eine Auflistung verfügbarer Sender soll angezeigt werden, wobei für jeden Sender
mehrere Attribute (thumbnail, Name, ... ) dargestellt werden sollen.
- Die Senderwahl soll durch einfache Auswahl in einer Liste erfolgen.
- Lange Listen sollen in Seiten aufgeteilt werden, sodass geblättert werden kann.
- Eine Liste soll durch Wahl bestimmter Eigenschaften reduziert werden können,
mindestens soll eine Beschränkung bzgl. Region und Genre möglich sein.
- Es soll möglich sein, eine Liste bzgl. wählbarer Texteigenschaften alphabetisch auf- und
abwärts zu sortieren.
- Die aktuelle Art der Sortierung soll angezeigt werden.
- Die Liste soll nach Zeichenketten durchsucht werden können, sodass bei Erfolg die
gefundenen Sendereinträge visuell hervorgehoben werden.
## Favoritenlisten
- Jeder BenutzerIn soll es möglich sein, mehrere persönliche Listen favorisierter Sender
im Client zu speichern und zu benennen.
- Die Übernahme von Sendern in eine Favoritenliste soll aus jeder angezeigten Liste
möglich sein.
- Es soll möglich sein, Listeneinträge aus Favoritenlisten zu löschen.
- Es soll möglich sein, Favoritenlisten zu löschen.
- Favoritenlisten sollen alternativ angezeigt werden können, auch alternativ zu den in
Kap. 2.3 beschriebenen extern bezogenen Listen.
- Meldet sich eine BenutzerIn gleichzeitig bei mehreren Clients an, so sollen die persönlichen
Favoritenlisten synchronisiert und aktualisiert werden.
## Audioplayer
- Durch die o.g. Senderwahl soll stets ein aktueller Sender (stream) definiert sein.
- Mindestens die Operationen Start, Stop und Lautstärkeänderung sollen mit geeigneten
Bedienelementen möglich sein.
- Die Elemente des Players sollen stets angezeigt werden.
- Die Einstellungen des Audioplayers und der aktuelle Sender sollen zwischen Clients
einer BenutzerIn synchronisiert werden.
- Zum Abspielen der streams soll das HTML5 audio-Element verwendet werden.
(Hier ist nicht das HTML5 WebAudio API gemeint, sondern das Element <audio ...> .)
- Die browserspezifischen Bedienelemente („controls“) des audio-Elements sollen nicht
verwendet werden.
- Die Methoden und Attribute des audio-Elements sollen mit eigenen Bedienelementen
angesteuert werden (siehe HinweiseZurHausarbeitSS17.pdf).

## Custom Element
- Es soll mindestens ein UI-widget eigener Wahl als HTML5 Custom Element selbst entwickelt
und sinnvoll verwendet werden.
- Es soll nur die aktuelle „Custom Element V1“ Technik verwendet werden (siehe
HinweiseZurHausarbeitSS17.pdf).
- Die Funktionalität und das Aussehen des Custom Elements soll mit eigenem
JavaScript-, HTML- und CSS-Code definiert werden. (Ein „umbenanntes“ div-Element ist
nicht hinreichend.)
- Die Verwendung des Shadow DOM ist nicht erforderlich und nicht gefordert.
- Custom Elements V1 können zur Zeit nur mit Chrome ausgeführt werden. Es sollen
keine Libraries verwendet werden, die Custom Elements V1 für andere Browser ermöglichen
(polyfills).
## Skins
- Die Darstellung der Seite soll mit unterschiedlichen skins (themes) gestaltet werden.
- Die BenutzerIn soll stets zwischen skins umschalten können.
- Es sollen mindestens drei unterschiedliche skins zur Verfügung stehen, z.B. hell, dunkel
und Weißbier.
## Netzkooperation
- Die myRadio - Clients sollen über den gegebenen Websocket-Broadcast-Server
ws://borsti.inf.fh-flensburg.de:8080/ kommunizieren.
- Mehrere Clients einer BenutzerIn sollen kooperieren können, um Daten zu synchronisieren.
- Alle Websocket-Nachrichten sollen nach einem beliebigen eigenen Verfahren verschlüsselt
werden, so dass nur Clients eines Typs die Nachrichten entschlüsseln
können.
- Die Senderlisten sollen von der Site https://dirble.com/ bezogen werden.
- Anfragen an das dirble-directory-API sollen über borsti erfolgen (siehe
HinweiseZurHausarbeitSS17.pdf).

# Allgemeine Implementationsanforderungen
- Die Anwendung soll realisiert werden mit:
    - HTML5
    - CSS3
    - JavaScript und DOM-Scripting
    - den HTML5 APIs: WebSocket, WebStorage, WebComponents/Custom Elements
    - JSON zur Formatierung der Kommunikationsdaten
    - HTML Canvas 2D oder SVG können verwendet werden
- Die Anwendung soll für die aktuelle Version von Google Chrome ausgelegt sein.
- Der Code soll den W3C-Validator http://validator.w3.org/ fehlerfrei passieren.
- Die HTML-Elemente sollen semantisch korrekt eingesetzt werden.
- Der JavaScript-Code soll objektorientiert entwickelt werden, den globalen Namensraum
nicht verletzen und den strict-Modus nutzen.
- Die intuitive Bedienbarkeit soll für die Gestaltung und das Layout der Anwendung maß-
gebend sein. Falls durch ansprechende Gestaltung ein positiver Eindruck entsteht, soll
dies nicht negativ bewertet werden.
- Die Persistenz der Registrierungsdaten, Favoritenlisten und Playereinstellungen soll
allein mit der WebStorageTechnik erreicht werden. Hierbei wird in Kauf genommen,
dass bedingt durch unterschiedliche online-Zeiten der Clients der Datenbestand nicht
immer überall korrekt ist.
- Es sollen keine zusätzlichen Bibliotheken oder Frameworks verwendet werden (z.B.
jQuery, Bootstrap, Polymer, Bricks, ... ).
- Der Anteil des statisch definierten oder per DOM-Scripting generierten Codes wird
nicht spezifiziert. Die Softwarearchitektur soll dies sinnvoll festlegen.

Dazu gehören:
- Projektordner
(siehe TeilnahmebedingungenWebTecHausarbeitSS17.pdf)
- Upload Ihrer ZIP-Datei nachnameMatrNr.zip
- Kurze Präsentation des Ergebnisses (ca. 5 Min.)
# Dokumentation
- Die Dokumentation (Projektordner) soll insbesondere
beschreiben:
    - das Layout und das Bedienkonzept dieser single-page
Anwendung
    - die Verwaltung/Erzeugung der Listendaten
    - den Einsatz der Custom Elements
    - den Einsatz des audio-Elements
    - die Nachrichtenverschlüsselung
    - die Definition der WebSocket-Nachrichtenkommunikation,
d.h. die Festlegung des eigenen Protokolls
    - das Speicherkonzept für die persistenten Daten
    - das Verfahren zur Synchronisation der Benutzerdaten
    - Probleme, Besonderheiten, Bemerkenswertes
    - evtl. nicht erfüllte Anforderungen
- Die Dokumentation soll aus Skizzen, Diagrammen, Bildern etc.
und kurzen, verständlichen, gehaltvollen, textuellen Beschreibungen
bestehen. Langatmiges Geschwafel führt zur Abwertung.
- Der Umfang der Text-Dokumentation (ohne Quellcode, Skizzen,
Diagramme, Bilder) soll 10 A4 Seiten nicht übersteigen (Richtwert
400 Wörter/Seite).
- Seiten ohne Header-Informationen (siehe Teilnahmebedingungen),
loses Blattwerk, rückwärts auf dem Kopf eingeheftete und
zusammen getackerte Seiten werden bei der Bewertung nicht
berücksichtigt.
