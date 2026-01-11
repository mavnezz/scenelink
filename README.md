# 🎉 SceneLink - Event Discovery PWA

Eine Progressive Web App zum Entdecken von Events und Connecten mit Gleichgesinnten. Inspiriert von Bumble, mit einem dunkelgrünen Design-Theme.

## ✨ Features

- 📱 **Swipe-Interface** - Swipe durch Events (rechts = interessiert, links = nicht interessiert)
- 🤝 **Matches** - Verbinde dich mit anderen Event-Interessierten
- 👤 **Profil** - Verwalte deine Interessen und kommende Events
- 💚 **Bumble-inspiriertes Design** - Modernes UI in Dunkelgrün
- 🔄 **Offline-fähig** - Funktioniert auch ohne Internetverbindung (PWA)
- 📲 **Installierbar** - Kann wie eine native App installiert werden

## 🚀 Installation & Start

### Lokal testen

1. **Repository klonen:**
   ```bash
   git clone <repository-url>
   cd scenelink
   ```

2. **Öffnen im Browser:**

   **Option A - Direkt öffnen:**
   - Öffne `index.html` direkt im Browser (Doppelklick)
   - ⚠️ Service Worker funktioniert nur über HTTP/HTTPS

   **Option B - Mit lokalem Server (empfohlen):**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # PHP
   php -S localhost:8000
   ```

   Dann im Browser öffnen: `http://localhost:8000`

### Als PWA installieren

1. Öffne die App in Chrome/Edge/Safari
2. Klicke auf das "Installieren" Icon in der Adressleiste
3. Die App wird wie eine native App installiert

## 📁 Projektstruktur

```
scenelink/
├── index.html          # Haupt-HTML-Datei
├── manifest.json       # PWA Manifest
├── sw.js              # Service Worker für Offline-Funktionalität
├── styles/
│   └── main.css       # Alle Styles (Bumble-inspiriert, dunkelgrün)
├── js/
│   ├── app.js         # Haupt-App-Logik
│   └── data.js        # Mock-Daten (Events, User, Matches)
├── assets/            # Icons (müssen noch hinzugefügt werden)
└── README.md
```

## 🎨 Design-Theme

- **Primärfarbe:** Dunkelgrün (#1a4d2e)
- **Akzentfarbe:** Hellgrün (#4caf50)
- **Hintergrund:** Dunkel (#0f0f0f)
- **Inspiration:** Bumble App Design

## 🔧 Anpassungen

### Mock-Daten ändern

Bearbeite [js/data.js](js/data.js):
- `MOCK_EVENTS` - Event-Daten
- `MOCK_USERS` - User-Profile
- `MOCK_MATCHES` - Bestehende Matches

### Design anpassen

Bearbeite [styles/main.css](styles/main.css):
- CSS-Variablen in `:root` für Farben
- Komponenten-Styles weiter unten

### Icons hinzufügen

1. Erstelle Icons in den Größen 192x192 und 512x512 Pixel
2. Speichere sie als `icon-192.png` und `icon-512.png` im `assets/` Ordner
3. Empfohlenes Tool: [RealFaviconGenerator](https://realfavicongenerator.net/)

## 📱 Features im Detail

### Event Swipe
- **Swipe rechts / Like Button:** Event als interessant markieren
- **Swipe links / Dislike Button:** Event überspringen
- **Info Button:** Detailansicht des Events
- Zufällige Match-Chance bei Likes (30%)

### Matches
- **Alle:** Zeigt alle Matches
- **Neu:** Nur neue Matches (mit grünem Punkt)
- **Bald:** Events, die bald stattfinden

### Profil
- User-Informationen
- Interessen-Tags
- Kommende Events (gelikte Events)

## 🌐 Deployment

### GitHub Pages
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Dann in GitHub Repository Settings → Pages → Source: main branch

### Vercel / Netlify
- Einfach das Repository connecten
- Automatisches Deployment bei jedem Push

### Andere Hosts
- Lade alle Dateien in den Web-Root deines Servers hoch
- Stelle sicher, dass HTTPS aktiviert ist (für PWA-Features)

## 📝 To-Do für Produktion

- [ ] Icons erstellen und hinzufügen (192x192, 512x512)
- [ ] Echte Backend-API implementieren
- [ ] Datenbank für Events und User
- [ ] Authentifizierung hinzufügen
- [ ] Chat-Funktionalität implementieren
- [ ] Push-Benachrichtigungen für neue Matches
- [ ] Geolocation für Event-Entfernungen
- [ ] Bezahlsystem für Event-Tickets

## 🎓 Uni-Präsentation

### Präsentations-Flow:
1. **Start:** Zeige die Event-Swipe-Funktion
2. **Swipe Demo:** Demonstriere Like/Dislike
3. **Match:** Zeige die Match-Animation
4. **Matches View:** Navigiere zu den Matches
5. **Profil:** Zeige das User-Profil
6. **PWA Features:** Installiere die App (optional)

### Wichtige Punkte:
- ✅ Vollständig funktionsfähiger Prototyp
- ✅ Responsive Design (funktioniert auf allen Geräten)
- ✅ Offline-fähig durch Service Worker
- ✅ Installierbar als PWA
- ✅ Bumble-inspiriertes, modernes Design
- ✅ Statische Daten - keine Backend benötigt

## 🤝 Zusammenarbeit

Dein Freund kann das Projekt einfach klonen und lokal laufen lassen:

```bash
git clone <repository-url>
cd scenelink
python -m http.server 8000
# Browser: http://localhost:8000
```

## 📄 Lizenz

Dieses Projekt ist für universitäre Zwecke erstellt.

---

**Erstellt mit ❤️ für die Uni-Präsentation**
