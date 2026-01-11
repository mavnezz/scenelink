# 🎉 SceneLink - Event Discovery PWA

**A Bumble-inspired Progressive Web App for discovering events and connecting with like-minded people in Bonn**

![Version](https://img.shields.io/badge/version-2.0-brightgreen) ![Language](https://img.shields.io/badge/language-English-blue) ![City](https://img.shields.io/badge/city-Bonn-orange)

---

## ✨ Overview

SceneLink is a complete research prototype for a university project, validating a business model for connecting event attendees with each other and with event managers. The app demonstrates all 6 core assumptions from the research objectives.

**Demo Location**: Bonn, Germany
**Language**: English
**Tech Stack**: Vanilla HTML/CSS/JavaScript (PWA)

---

## 🎯 Research Objectives Addressed

### Primary Assumptions Tested:

1. ✅ **Newcomers need access points for socializing**
   - Onboarding flow with newcomer identification
   - Dedicated newcomer events
   - "New in Bonn" badge in profiles

2. ✅ **People want to connect with like-minded individuals**
   - Interest-based matching algorithm
   - Common interests displayed in matches
   - 15 interest categories to choose from

3. ✅ **People like to discover activities in their city**
   - 8 event categories with filter system
   - Map view for location-based discovery
   - 12 diverse mock events

4. ✅ **Overcoming social anxiety and comfort zones**
   - "Going Solo" feature showing how many attend alone
   - Lowers hesitation barrier for solo attendance

5. ✅ **Customers have higher awareness of circularity**
   - 3 sustainability-focused community events
   - Sustainability badges on event cards
   - Dedicated "Sustainable events only" filter

6. ✅ **Event managers need promotion channels**
   - Integrated ticket purchase flow
   - Attendee metrics ("Going Solo" count)
   - Conversion points built in

---

## 🚀 Features

### Core Functionality

#### 1. **Onboarding Flow**
- Welcome screen
- Newcomer status selection
- Interest selection (minimum 3 from 15 categories)
- Data persisted in localStorage

#### 2. **Event Swipe Interface**
- Bumble-style card swiping
- Touch and mouse support
- Visual indicators (INTERESTED / NOPE)
- 3-card stack effect

#### 3. **Intelligent Matching**
- 40% match chance with common interests
- Match animation showing both users
- Common interests tags displayed
- Event context maintained

#### 4. **Event Discovery**
- **8 Categories**: Concerts, Art & Culture, Sports, Food & Drink, Party, Workshops, Outdoor, Community
- **12 Events** including:
  - 8 regular events
  - 3 sustainability events (Food Waste Cooking, Fashion Swap, Urban Gardening)
  - 1 newcomer welcome meetup

#### 5. **Advanced Filtering**
- Category pills (horizontal scroll)
- Sustainable events only
- Newcomer events only
- Free events only

#### 6. **"Going Solo" Support**
- Badge on each event showing solo attendees
- Reduces social anxiety
- Encourages solo participation

#### 7. **Chat & Messaging**
- 1:1 chat with matches
- Event context always visible
- Send messages functionality

#### 8. **Map View**
- Alternative discovery method
- Events listed by location
- Click for event details

#### 9. **Ticket Purchase**
- In-app ticket buying flow (mockup)
- Event information display
- Price calculation
- Demo mode indicator

#### 10. **User Profile**
- Newcomer badge (if applicable)
- Editable interests
- Upcoming events list
- Statistics dashboard:
  - Events attended
  - Total matches
  - Interests count

---

## 📊 Mock Data

- **15 Interest Categories**: Music, Concerts, Art, Sports, Yoga, Food, Party, Culture, Outdoor, Photography, Workshops, Networking, Sustainability, Techno, Indie

- **12 Events** in Bonn:
  - Summer Jazz Night
  - Street Art Workshop
  - Rooftop Yoga Session
  - Food Market Festival
  - Indie Rock Concert
  - Photography Walk
  - Techno Open Air
  - Book Club Meetup
  - **Food Waste Cooking Class** (Sustainable)
  - **Second-Hand Fashion Swap** (Sustainable)
  - **Urban Gardening Workshop** (Sustainable)
  - **Newcomers Welcome Meetup** (Newcomer Event)

- **8 User Profiles** with varying interests and newcomer status

---

## 🎓 Perfect for University Presentation

### Demo Flow (5-6 minutes):

1. **Onboarding** (1 min)
   - Show welcome → newcomer question → interest selection

2. **Event Swipe** (1 min)
   - Demonstrate different event types
   - Show sustainability badge
   - Highlight "Going Solo" feature

3. **Match** (30 sec)
   - Trigger match animation
   - Show common interests

4. **Chat** (30 sec)
   - Open chat with match
   - Send message

5. **Filters** (30 sec)
   - Apply sustainability filter
   - Show newcomer filter

6. **Profile** (30 sec)
   - Show stats and newcomer badge
   - Display interests

7. **Map View** (30 sec)
   - Alternative discovery method

8. **Ticket Purchase** (30 sec)
   - Demonstrate ticket flow

---

## 💻 Quick Start

### Prerequisites
- Python 3 (for local server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Running Locally

```bash
# Navigate to project directory
cd scenelink

# Start local server
python3 -m http.server 8080

# Open in browser
http://localhost:8080
```

### First Launch
1. Complete onboarding flow
2. Select newcomer status
3. Choose at least 3 interests
4. Start exploring!

### Reset Demo
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

## 📁 Project Structure

```
scenelink/
├── index.html          # Main app (English, Bonn)
├── manifest.json       # PWA manifest
├── sw.js              # Service worker (offline support)
├── styles/
│   ├── main.css       # Base styles (Bumble-inspired, dark green)
│   └── extended.css   # Extended features styles
├── js/
│   ├── data.js        # Mock data (12 events, 8 users, Bonn)
│   └── app.js         # Complete app logic (22KB)
├── assets/
│   └── create-icons.html  # Icon generator
├── README.md          # Original documentation
├── FEATURES.md        # Complete feature list + research mapping
├── UPDATES.md         # What's new
└── QUICKSTART.md      # Quick start guide
```

---

## 🎨 Design

- **Primary Color**: Dark Green (#1a4d2e)
- **Accent Color**: Light Green (#4caf50)
- **Background**: Dark (#0f0f0f)
- **Inspiration**: Bumble App
- **Mobile-First**: Responsive design
- **Max Width**: 430px (optimized for mobile)

---

## 📈 Measurable Metrics

The app allows tracking of:

1. Onboarding completion rate
2. Newcomer vs. local split
3. Interest distribution
4. Event category preferences
5. Filter usage (sustainable, newcomer, free)
6. Match rate with common interests
7. "Going Solo" impact
8. Ticket purchase interest
9. Chat engagement

---

## 🔄 Value Proposition Validation

### For Event Attendees:
✅ Centralized event discovery platform
✅ Social component (matches)
✅ Interest-based matching
✅ Newcomer support
✅ "Going Solo" encouragement
✅ Sustainability focus

### For Event Managers:
✅ Promotion channel
✅ Ticket sales integration
✅ Attendee metrics
✅ "Going Solo" analytics
✅ Conversion tracking

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Option 2: Netlify
1. Drag & drop project folder to [Netlify](https://netlify.com)
2. Done!

### Option 3: GitHub Pages
1. Repository Settings → Pages
2. Source: main branch
3. URL: `https://username.github.io/scenelink`

---

## 🚧 Next Steps for Production

- [ ] Backend API
- [ ] Real database
- [ ] User authentication
- [ ] Payment system integration
- [ ] Real geolocation
- [ ] Push notifications
- [ ] Event manager dashboard
- [ ] User-generated content
- [ ] Post-event ratings
- [ ] Group matches

---

## 📄 Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature list with research mapping
- **[UPDATES.md](UPDATES.md)** - Changelog and new features
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide

---

## 🎉 Ready for Presentation!

The app is a **complete research prototype** that validates all assumptions from your university project!

**Server is running on**: http://localhost:8080

**Good luck with your presentation! 🚀**

---

**Created**: January 2026
**Version**: 2.0 - Full Research Edition (English, Bonn)
**License**: Educational Use
