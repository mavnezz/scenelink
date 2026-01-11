# 🚀 SceneLink - Quick Start Guide

## Sofort loslegen (3 Schritte)

### 1. Repository auf GitHub hochladen

```bash
# Im scenelink Ordner:
git add .
git commit -m "Initial SceneLink PWA"
git push origin main
```

### 2. Lokal testen

**Einfachste Methode - Python Server:**

```bash
# Im scenelink Ordner:
python -m http.server 8000
```

Dann Browser öffnen: **http://localhost:8000**

**Alternative - PHP:**
```bash
php -S localhost:8000
```

### 3. Icons erstellen (Optional aber empfohlen)

1. Öffne im Browser: `http://localhost:8000/assets/create-icons.html`
2. Rechtsklick auf jedes Icon → "Bild speichern unter..."
3. Speichere als `icon-192.png` und `icon-512.png` im `assets/` Ordner

## ✅ Checkliste für Präsentation

- [x] App läuft lokal
- [ ] Icons erstellt und gespeichert
- [ ] Mit GitHub synchronisiert
- [ ] Optional: Auf Vercel/Netlify deployed

## 🎯 Features zum Zeigen

1. **Event Swipe** - Hauptfeature, rechts/links swipen
2. **Match Animation** - Erscheint zufällig beim Liken
3. **Matches View** - Zeigt alle Connections
4. **Profile** - User-Profil mit Interessen
5. **PWA** - Kann installiert werden (Chrome: ⊕ Icon in Adressleiste)

## 🌐 Kostenlos Online hosten (Optional)

### Vercel (Empfohlen)
1. Gehe zu [vercel.com](https://vercel.com)
2. "New Project" → GitHub Repository auswählen
3. Deploy - Fertig! (dauert ~30 Sekunden)

### Netlify
1. Gehe zu [netlify.com](https://netlify.com)
2. Drag & Drop den `scenelink` Ordner
3. Fertig!

### GitHub Pages
1. GitHub Repository → Settings → Pages
2. Source: "main" Branch auswählen
3. URL: `https://dein-username.github.io/scenelink`

## 🐛 Troubleshooting

**Problem:** Icons werden nicht angezeigt
- **Lösung:** Icons mit `create-icons.html` erstellen oder Platzhalter verwenden

**Problem:** Service Worker Error
- **Lösung:** Über HTTP Server öffnen (nicht direkt die HTML-Datei)

**Problem:** Swipe funktioniert nicht
- **Lösung:** Browser aktualisieren, funktioniert am besten in Chrome/Edge

## 💡 Demo-Tipps

- Zeige zuerst die Swipe-Funktion (intuitiv und beeindruckend)
- Like ein paar Events um ein Match zu triggern
- Navigiere durch alle 3 Tabs (Events, Matches, Profil)
- Erwähne, dass es eine PWA ist (offline-fähig, installierbar)
- Betone das Bumble-inspirierte Design in Dunkelgrün

## 📱 Für Präsentation auf dem Handy

1. Deployed URL öffnen (oder lokale IP: `python -m http.server 8000`)
2. In Chrome/Safari: "Zum Startbildschirm hinzufügen"
3. App öffnet sich wie eine native App!

---

**Du bist ready! 🎉**
