# Mila Französisch 4. Klasse

Eigenes Git-Repository für Französisch-Übungsmaterial für Mila.

Kontext:

- Schülerin: Mila
- Schule: Judith Kerr Grundschule, Berlin
- Profil: Deutsch-Französisch
- Track: Deutsch-Track, also Französisch nicht als Muttersprache
- Klasse: 4. Klasse
- Ziel: Übung im Stil französischer Grundschul-Evaluationen

## Ordner

- `arbeitsblaetter/` - fertige Quarto-Arbeitsblätter (`.qmd`)
- `lernzettel/` - kompakte Wiederholungszettel und PDFs
- `loesungen/` - Lösungsvorschläge zu Arbeitsblättern
- `site/` - interaktive Übungswebsite für Mila
- `vorlagen/` - wiederverwendbare Quarto-Vorlagen
- `hinweise/` - dauerhafte Codex-Anweisungen und pädagogische Notizen

## Website lokal starten

Im Ordner `site/` kann ein kleiner Webserver gestartet werden:

```sh
python3 -m http.server 8765 --bind 0.0.0.0
```

Dann ist die Website im selben WLAN über die IP-Adresse des Macs erreichbar,
zum Beispiel `http://<mac-ip>:8765/`.

## Arbeitsweise

Neue Arbeitsblätter sollen die Regeln in
`hinweise/codex-instructions.md` befolgen.

Der Schwerpunkt liegt nicht auf Anfänger-Dialogen, sondern auf Grammatik in
Sätzen:

- konjugierte Verben erkennen
- Infinitive finden
- Subjekt, Verb und Ergänzung bestimmen
- Homophone sicher verwenden
- Zeiten erkennen
- Nominalgruppen angleichen
- vollständige Antworten schreiben
- kurze Texte im Futur verfassen
