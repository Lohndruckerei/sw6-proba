# Proba – Druckdaten-Prüfung und Freigabe für Shopware 6

> In Entwicklung – Gerüst und Konzept, noch nicht nutzbar.

Shopware-6.7-Plugin der Lohndruckerei: Druckdaten-Upload je Bestellposition, automatische Prüfung (Preflight), Fehlermeldungen an Kunden, Korrekturabzug mit Freigabe-Knopf in der Mail und Druckdaten-Archiv.
Teil der Familie [Ordo](https://github.com/Lohndruckerei/sw6-ordo) (Auftragsworkflow), allein lauffähig.

## Dokumentation
- [Konzept, Datenmodell, Fahrplan, offene Fragen](docs/KONZEPT.md)
- [Schnittstellen](docs/INTEGRATION.md) · [Entwicklung](docs/ENTWICKLUNG.md)

## Installation (Entwicklung)
```bash
docker exec shopware bash -c "cd /var/www/html && bin/console plugin:refresh && bin/console plugin:install --activate LdProba"
```
