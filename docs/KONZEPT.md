# Proba – Konzept

Proba übernimmt alles rund um die **Druckdaten**: Upload je Bestellposition, automatische Prüfung,
manuelle Prüfung, Fehlermeldungen, Korrekturabzug und Freigabe durch den Kunden. Proba ist eigenständig
lauffähig; im Zusammenspiel meldet es Ordo, wann eine Position druckfertig ist.

Stand: 2026-11-12 · Status: Konzept, Gerüst angelegt · Gesamtablauf: `sw6-ordo/docs/KONZEPT.md`

## 1. Ablauf

```
Upload (Shop/Mail/Admin) → automatische Prüfung → ┬─ in Ordnung ──────────────→ (Korrekturabzug?) → freigegeben
                                                  ├─ Warnung → Datenprüfung (manuell) ┘
                                                  └─ Fehler  → Fehlermeldung an Kunden → neuer Upload ↺
```

1. **Upload** – im Checkout („Daten jetzt hochladen“ oder „später“), im Kundenkonto je Position, über
   den Link in einer Proba-Mail oder durch einen Mitarbeiter (Daten per Mail/WeTransfer erhalten).
   Jede Datei ist eine **Version**; alte Versionen bleiben erhalten.
2. **Automatische Prüfung** (asynchron über die Message Queue) gegen die Konfiguration aus Mensura:
   Endformat und Beschnitt, Seitenzahl/Motive, Auflösung, Farbraum, eingebettete Schriften,
   Schneidkontur (Sonderfarbe, z. B. `CutContour`) bei Freiformschnitt, Weiß/Sonderfarben.
   Ergebnis: `ok`, `warning` oder `error` mit **Prüfbericht** (Text + markierte Vorschau).
3. **Manuelle Prüfung** – Warteschlange „Datenprüfung“ (Arbeitsplatz in Ordo). Der Mitarbeiter sieht
   Vorschau, Bericht und Konfiguration und entscheidet: Freigeben, Korrekturabzug senden,
   Fehlermeldung senden.
4. **Fehlermeldung** – vordefinierte Bausteine (z. B. „Beschnitt fehlt“, „Auflösung zu gering“,
   „Schneidkontur fehlt“) plus Freitext; Mail mit Knopf „Neue Daten hochladen“.
5. **Korrekturabzug** – PDF/Bild-Vorschau mit Maßen und Schnittlinie; Mail mit Knöpfen **„Freigeben“**
   und **„Änderung / neue Daten“**. Der Knopf öffnet eine Seite im Shop (signierter Link, ohne Login
   nutzbar, begrenzt gültig). Jede Freigabe wird mit Zeitpunkt, Version, IP und Wortlaut gespeichert
   (Haftung).
6. **Freigabe** – automatisch (Prüfung `ok`, kein Korrekturabzug nötig) oder durch Kunde/Mitarbeiter.
   Ab Produktionsstart bzw. Lieferantenbestellung ist kein Datentausch mehr möglich.

## 2. Nutzen statt bauen

| Vorhanden | Nutzung |
|---|---|
| Mensura-Konfiguration (`ldMensura`-Payload, Schnappschuss) | Sollwerte der Prüfung (Format, Motive, Schnitt). Reservierter Schlüssel `ldMensura.artwork` für die Verknüpfung |
| LieferLotse `artwork_out`, Mail-Typ `ld_supplier_artwork`, `SupplierOrder::addArtworkFile()` | freigegebene Druckdaten an Lieferanten übergeben |
| Shopware Mail-Templates, Flow Builder | alle Kundenmails; Flow-Ereignisse `proba.artwork.*` |
| Shopware privates Dateisystem, Message Queue | Speicherung und asynchrone Prüfung |

## 3. Datenmodell (Entwurf)

| Entity | Inhalt |
|---|---|
| `ld_proba_artwork` | je Bestellposition: Status (`missing`, `checking`, `ok`, `warning`, `error`, `awaiting_approval`, `approved`, `locked`), aktuelle Version |
| `ld_proba_artwork_file` | Version: Datei (privat bzw. externer Server), Prüfsumme, Hochgeladen von, Prüfbericht (JSON), Vorschaubilder |
| `ld_proba_approval` | Korrekturabzug: Token, gültig bis, Ergebnis, Zeitpunkt, IP, Kommentar |
| `ld_proba_message_block` | Textbausteine für Fehlermeldungen (übersetzbar) |
| `ld_proba_check_profile` | Prüfregeln je Kalkulation/Material (Beschnitt mm, min. DPI, Kontur Pflicht …) |

## 4. Schnittstellen

- Events/Flow: `proba.artwork.uploaded`, `.checked`, `.rejected`, `.approval_requested`, `.approved`.
- Service `ArtworkStatusProvider::forOrder($orderId)` – Ordo liest den Status je Position.
- Prüfwerkzeug austauschbar (`PreflightEngineInterface`): Stufe 1 Open Source (Ghostscript/qpdf/pdfcpu),
  später optional callas pdfToolbox (Entscheidung E3 in Ordo).
- Archiv: Ablage auf externem Server über Flysystem (SFTP/S3), Entscheidung E4 in Ordo.

## 5. Fahrplan

1. Gerüst ✔ · 2. Upload je Position (Admin, dann Shop) · 3. automatische Prüfung + Bericht ·
4. Arbeitsplatz Datenprüfung + Fehlermeldungen · 5. Korrekturabzug + Freigabe-Link · 6. Archiv extern.

## 6. Offene Fragen

- Welche Dateiformate werden angenommen (nur PDF oder auch AI/EPS/TIFF/JPG/PNG)? Maximale Größe?
- Gibt es einen kostenpflichtigen „Profi-Datencheck“ bzw. Korrekturabzug als Option im Konfigurator?
- Frist für neue Daten und Freigabe, Erinnerungen (Ordo E7).
- Erstellt die Datenprüfung Druckdaten selbst (Gestaltungsservice, Korrektur durch uns)?
