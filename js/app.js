// SceneLink App Logic - Extended Version

// State Management
let currentEventIndex = 0;
let eventStack = [...MOCK_EVENTS];
let filteredEvents = [...MOCK_EVENTS];
let userLikes = [];
let userDislikes = [];
let activeCategory = 'all';
let activeFilters = {
  sustainable: false,
  newcomer: false,
  free: false
};
let currentChat = null;

// Initialize App
function init() {
  // Check if user has completed onboarding
  const onboarding = localStorage.getItem('onboarding_completed');

  if (!onboarding) {
    showOnboarding();
  } else {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      CURRENT_USER = JSON.parse(savedUser);
    }
    showMainApp();
  }
}

// Onboarding Functions
function showOnboarding() {
  document.getElementById('onboardingFlow').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  renderInterestsGrid();
}

function showMainApp() {
  document.getElementById('onboardingFlow').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  initMainApp();
}

function nextOnboardingStep() {
  document.getElementById('onboardingWelcome').classList.remove('active');
  document.getElementById('onboardingNewcomer').classList.add('active');
}

function setNewcomer(isNewcomer) {
  CURRENT_USER.isNewcomer = isNewcomer;
  document.getElementById('onboardingNewcomer').classList.remove('active');
  document.getElementById('onboardingInterests').classList.add('active');
}

function renderInterestsGrid() {
  const grid = document.getElementById('interestsGrid');
  grid.innerHTML = AVAILABLE_INTERESTS.map(interest => `
    <button class="interest-btn" onclick="toggleInterest('${interest.id}')">
      <span class="interest-btn-icon">${interest.icon}</span>
      <span class="interest-btn-name">${interest.name}</span>
    </button>
  `).join('');
}

function toggleInterest(interestId) {
  const index = CURRENT_USER.interests.indexOf(interestId);
  const btn = event.target.closest('.interest-btn');

  if (index > -1) {
    CURRENT_USER.interests.splice(index, 1);
    btn.classList.remove('selected');
  } else {
    CURRENT_USER.interests.push(interestId);
    btn.classList.add('selected');
  }

  updateInterestCounter();
}

function updateInterestCounter() {
  const count = CURRENT_USER.interests.length;
  document.getElementById('selectedCount').textContent = count;
  document.getElementById('continueInterests').disabled = count < 3;
}

function completeOnboarding() {
  CURRENT_USER.hasCompletedOnboarding = true;
  localStorage.setItem('onboarding_completed', 'true');
  localStorage.setItem('current_user', JSON.stringify(CURRENT_USER));
  showMainApp();
}

function skipOnboarding() {
  CURRENT_USER.interests = ['musik', 'kunst', 'food']; // Default interests
  completeOnboarding();
}

function editInterests() {
  // Show interests selection again
  renderInterestsGrid();
  // Mark currently selected interests
  CURRENT_USER.interests.forEach(id => {
    const buttons = document.querySelectorAll('.interest-btn');
    buttons.forEach(btn => {
      if (btn.textContent.includes(AVAILABLE_INTERESTS.find(i => i.id === id)?.name)) {
        btn.classList.add('selected');
      }
    });
  });
  alert('Interests editing would appear in fullscreen here');
}

// Main App Initialization
function initMainApp() {
  console.log('Initializing main app...');

  renderCategoryPills();
  renderEventCards();
  loadMatches();
  loadProfile();

  // Button listeners
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');
  const infoBtn = document.getElementById('infoBtn');
  const filterBtn = document.getElementById('filterBtn');

  if (likeBtn) likeBtn.addEventListener('click', () => handleSwipe('like'));
  if (dislikeBtn) dislikeBtn.addEventListener('click', () => handleSwipe('dislike'));
  if (infoBtn) infoBtn.addEventListener('click', () => {
    if (eventStack[currentEventIndex]) {
      showEventDetail(eventStack[currentEventIndex]);
    }
  });

  // Filter button
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      document.getElementById('filterModal').classList.remove('hidden');
    });
  }

  // Match notification listeners
  const keepSwipingBtn = document.getElementById('keepSwipingBtn');
  const sendMessageBtn = document.getElementById('sendMessageBtn');

  if (keepSwipingBtn) {
    keepSwipingBtn.addEventListener('click', () => {
      document.getElementById('matchNotification').classList.add('hidden');
    });
  }

  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', () => {
      document.getElementById('matchNotification').classList.add('hidden');
      openChat(MOCK_MATCHES[0]);
    });
  }

  // Modal close
  const modalClose = document.getElementById('modalClose');
  const eventModal = document.getElementById('eventModal');

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      eventModal.classList.add('hidden');
    });
  }

  if (eventModal) {
    eventModal.addEventListener('click', (e) => {
      if (e.target.id === 'eventModal') {
        eventModal.classList.add('hidden');
      }
    });
  }

  // Navigation
  setupNavigation();

  // Tabs in Matches View
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadMatches(tab.dataset.tab);
    });
  });

  console.log('Main app initialized successfully');
}

// Navigation
function setupNavigation() {
  console.log('Setting up navigation...');
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  console.log('Found nav items:', navItems.length);
  console.log('Found views:', views.length);

  navItems.forEach((item, index) => {
    console.log(`Adding listener to nav item ${index}:`, item.dataset.view);
    item.addEventListener('click', (e) => {
      console.log('Nav item clicked:', item.dataset.view);
      const targetView = item.dataset.view;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      views.forEach(view => view.classList.remove('active'));
      const targetElement = document.getElementById(targetView);
      if (targetElement) {
        targetElement.classList.add('active');
        console.log('Switched to view:', targetView);
      } else {
        console.error('Target view not found:', targetView);
      }

      if (targetView === 'matchesView') {
        loadMatches();
      } else if (targetView === 'profileView') {
        loadProfile();
      } else if (targetView === 'mapView') {
        loadMapView();
      }
    });
  });

  console.log('Navigation setup complete');
}

// Category Pills
function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  container.innerHTML = EVENT_CATEGORIES.map(cat => `
    <button class="category-pill ${cat.id === 'all' ? 'active' : ''}"
            onclick="filterByCategory('${cat.id}')">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join('');
}

function filterByCategory(categoryId) {
  activeCategory = categoryId;

  // Update active pill
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  event.target.closest('.category-pill').classList.add('active');

  // Filter events
  applyAllFilters();
}

function applyAllFilters() {
  filteredEvents = MOCK_EVENTS.filter(event => {
    // Category filter
    if (activeCategory !== 'all' && event.category !== activeCategory) {
      return false;
    }

    // Sustainability filter
    if (activeFilters.sustainable && !event.isSustainable) {
      return false;
    }

    // Newcomer filter
    if (activeFilters.newcomer && !event.isNewcomerEvent) {
      return false;
    }

    // Free filter
    if (activeFilters.free && !event.price.toLowerCase().includes('kostenlos') && !event.price.toLowerCase().includes('frei')) {
      return false;
    }

    return true;
  });

  eventStack = [...filteredEvents];
  currentEventIndex = 0;
  renderEventCards();
}

function closeFilter() {
  document.getElementById('filterModal').classList.add('hidden');
}

function applyFilters() {
  activeFilters.sustainable = document.getElementById('filterSustainable').checked;
  activeFilters.newcomer = document.getElementById('filterNewcomer').checked;
  activeFilters.free = document.getElementById('filterFree').checked;

  applyAllFilters();
  closeFilter();
}

function resetFilters() {
  activeCategory = 'all';
  activeFilters = { sustainable: false, newcomer: false, free: false };

  document.getElementById('filterSustainable').checked = false;
  document.getElementById('filterNewcomer').checked = false;
  document.getElementById('filterFree').checked = false;

  applyAllFilters();
  closeFilter();

  // Reset category pills
  renderCategoryPills();
}

// Render Event Cards
function renderEventCards() {
  const container = document.getElementById('eventCards');
  const noMoreCards = document.getElementById('noMoreCards');

  container.innerHTML = '';

  if (currentEventIndex >= eventStack.length) {
    noMoreCards.classList.remove('hidden');
    return;
  }

  noMoreCards.classList.add('hidden');

  // Render current and next 2 cards for stack effect
  for (let i = currentEventIndex; i < Math.min(currentEventIndex + 3, eventStack.length); i++) {
    const card = createEventCard(eventStack[i], i - currentEventIndex);
    container.appendChild(card);
  }

  // Add swipe listeners to top card
  const topCard = container.querySelector('.event-card');
  if (topCard) {
    addSwipeListeners(topCard);
  }
}

// Create Event Card Element
function createEventCard(event, stackIndex) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.style.zIndex = 100 - stackIndex;
  card.style.transform = `scale(${1 - stackIndex * 0.05}) translateY(${stackIndex * 10}px)`;

  const sustainabilityBadge = event.isSustainable
    ? `<div class="sustainability-badge">♻️ ${event.sustainabilityType}</div>`
    : '';

  const goingSoloBadge = event.goingSolo > 0
    ? `<div class="going-solo-badge">${event.goingSolo} going solo</div>`
    : '';

  card.innerHTML = `
    <div class="event-image-container">
      <img src="${event.image}" alt="${event.title}" class="event-image">
      ${sustainabilityBadge}
      <div class="event-badge">${event.type}</div>
      ${goingSoloBadge}
      <div class="swipe-indicator like">INTERESTED</div>
      <div class="swipe-indicator dislike">NOPE</div>
    </div>
    <div class="event-info">
      <div>
        <h2 class="event-title">${event.title}</h2>
        <div class="event-details">
          <div class="event-detail-item">
            📅 ${formatDate(event.date)} • ${event.time}
          </div>
          <div class="event-detail-item">
            📍 ${event.location} • ${event.distance}
          </div>
          <div class="event-detail-item">
            💰 ${event.price}
          </div>
        </div>
        <div class="event-tags">
          ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="attendees-count">
        👥 ${event.attendees} interested
      </div>
    </div>
  `;

  card.dataset.eventId = event.id;
  return card;
}

// Add Swipe Listeners
function addSwipeListeners(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const likeIndicator = card.querySelector('.swipe-indicator.like');
  const dislikeIndicator = card.querySelector('.swipe-indicator.dislike');

  card.addEventListener('mousedown', dragStart);
  card.addEventListener('touchstart', dragStart);

  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);

  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    card.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;

    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const rotation = deltaX * 0.1;

    card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;

    if (deltaX > 0) {
      likeIndicator.style.opacity = Math.min(deltaX / 100, 1);
      dislikeIndicator.style.opacity = 0;
    } else {
      dislikeIndicator.style.opacity = Math.min(Math.abs(deltaX) / 100, 1);
      likeIndicator.style.opacity = 0;
    }
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = currentX - startX;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      handleSwipe(deltaX > 0 ? 'like' : 'dislike');
    } else {
      card.style.transition = 'transform 0.3s ease';
      card.style.transform = 'translateX(0) rotate(0)';
      likeIndicator.style.opacity = 0;
      dislikeIndicator.style.opacity = 0;
    }
  }
}

// Handle Swipe Action
function handleSwipe(action) {
  const currentEvent = eventStack[currentEventIndex];
  const card = document.getElementById('eventCards').querySelector('.event-card');

  if (!card || !currentEvent) return;

  if (action === 'like') {
    userLikes.push(currentEvent.id);
    card.classList.add('removing', 'like');

    // Check for interest match and random chance (40%)
    const hasCommonInterests = currentEvent.interests.some(i => CURRENT_USER.interests.includes(i));
    if (hasCommonInterests && Math.random() < 0.4) {
      setTimeout(() => showMatchNotification(currentEvent), 500);
    }
  } else {
    userDislikes.push(currentEvent.id);
    card.classList.add('removing', 'dislike');
  }

  setTimeout(() => {
    currentEventIndex++;
    renderEventCards();
  }, 500);
}

// Show Match Notification
function showMatchNotification(event) {
  const matchedUser = MOCK_USERS.find(u =>
    u.interests.some(i => event.interests.includes(i))
  ) || MOCK_USERS[0];

  const commonInterests = matchedUser.interests.filter(i => CURRENT_USER.interests.includes(i));

  document.getElementById('matchName').textContent = matchedUser.name;
  document.getElementById('matchAvatar1').src = CURRENT_USER.avatar;
  document.getElementById('matchAvatar2').src = matchedUser.avatar;

  const commonInterestsHtml = commonInterests.map(id => {
    const interest = AVAILABLE_INTERESTS.find(i => i.id === id);
    return interest ? `<span class="common-interest-tag">${interest.icon} ${interest.name}</span>` : '';
  }).join('');

  document.getElementById('commonInterestsMatch').innerHTML = commonInterestsHtml;
  document.getElementById('matchNotification').classList.remove('hidden');

  // Add to matches
  const newMatch = {
    id: Date.now(),
    user: matchedUser,
    event: event,
    matchDate: new Date().toISOString(),
    isNew: true,
    lastMessage: 'New match! Say hello 👋',
    messageTime: 'Now',
    commonInterests: commonInterests
  };
  MOCK_MATCHES.unshift(newMatch);
}

// Show Event Detail Modal
function showEventDetail(event) {
  const detail = document.getElementById('eventDetail');
  const ticketButton = event.hasTickets
    ? `<button class="btn-primary" onclick="showTicketModal(${event.id})">Ticket kaufen</button>`
    : '';

  detail.innerHTML = `
    <img src="${event.image}" alt="${event.title}" class="event-detail-image">
    <h2 class="event-detail-title">${event.title}</h2>
    <div class="event-detail-info">
      <div class="event-detail-item">
        <strong>Type:</strong> ${event.type}
      </div>
      <div class="event-detail-item">
        <strong>Date:</strong> ${formatDate(event.date)} at ${event.time}
      </div>
      <div class="event-detail-item">
        <strong>Location:</strong> ${event.location}, ${event.city}
      </div>
      <div class="event-detail-item">
        <strong>Distance:</strong> ${event.distance}
      </div>
      <div class="event-detail-item">
        <strong>Price:</strong> ${event.price}
      </div>
      <div class="event-detail-item">
        <strong>Interested:</strong> ${event.attendees} people
      </div>
      ${event.goingSolo > 0 ? `<div class="event-detail-item"><strong>Going solo:</strong> ${event.goingSolo} people</div>` : ''}
    </div>
    <p class="event-detail-description">${event.description}</p>
    <div class="event-tags">
      ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    ${ticketButton}
  `;

  document.getElementById('eventModal').classList.remove('hidden');
}

// Load Matches
function loadMatches(filter = 'all') {
  const matchesList = document.getElementById('matchesList');
  matchesList.innerHTML = '';

  let filteredMatches = MOCK_MATCHES;

  if (filter === 'new') {
    filteredMatches = MOCK_MATCHES.filter(m => m.isNew);
  } else if (filter === 'upcoming') {
    const today = new Date();
    filteredMatches = MOCK_MATCHES.filter(m => new Date(m.event.date) > today);
  }

  // Update tab counts
  document.querySelectorAll('.tab-count')[0].textContent = MOCK_MATCHES.length;
  document.querySelectorAll('.tab-count')[1].textContent = MOCK_MATCHES.filter(m => m.isNew).length;
  document.querySelectorAll('.tab-count')[2].textContent = MOCK_MATCHES.filter(m => new Date(m.event.date) > new Date()).length;

  filteredMatches.forEach(match => {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card' + (match.isNew ? ' new' : '');

    matchCard.innerHTML = `
      <img src="${match.user.avatar}" alt="${match.user.name}" class="match-avatar">
      <div class="match-info">
        <div class="match-name">${match.user.name}, ${match.user.age}</div>
        <div class="match-event">📍 ${match.event.title}</div>
        <div class="match-message">${match.lastMessage}</div>
      </div>
      <div class="match-time">${match.messageTime}</div>
    `;

    matchCard.addEventListener('click', () => openChat(match));
    matchesList.appendChild(matchCard);
  });

  if (filteredMatches.length === 0) {
    matchesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Keine Matches gefunden</p>';
  }
}

// Chat Functions
function openChat(match) {
  currentChat = match;
  document.getElementById('chatAvatar').src = match.user.avatar;
  document.getElementById('chatName').textContent = match.user.name;
  document.getElementById('chatEvent').textContent = match.event.title;

  // Load chat messages (demo)
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = `
    <div class="chat-message received">
      <div>${match.lastMessage}</div>
      <div class="chat-time">${match.messageTime}</div>
    </div>
  `;

  // Switch to chat view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('chatView').classList.add('active');
}

function closeChat() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('matchesView').classList.add('active');
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (!message) return;

  const messagesContainer = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message sent';
  messageEl.innerHTML = `
    <div>${message}</div>
    <div class="chat-time">Jetzt</div>
  `;

  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  input.value = '';
}

// Map View
function loadMapView() {
  const mapEventsList = document.getElementById('mapEventsList');
  mapEventsList.innerHTML = eventStack.map(event => `
    <div class="map-event-item" onclick="showEventDetail(MOCK_EVENTS.find(e => e.id === ${event.id}))">
      <div><strong>${event.title}</strong></div>
      <div style="color: var(--text-secondary); font-size: 0.9rem;">
        📍 ${event.location} • ${event.distance}
      </div>
    </div>
  `).join('');
}

// Load Profile
function loadProfile() {
  console.log('Loading profile...');

  const profileName = document.getElementById('profileName');
  const profileBio = document.getElementById('profileBio');
  const profileAvatar = document.getElementById('profileAvatar');
  const newcomerBadge = document.getElementById('newcomerBadge');
  const interestsContainer = document.getElementById('profileInterests');
  const upcomingEvents = document.getElementById('upcomingEvents');
  const statEvents = document.getElementById('statEvents');
  const statMatches = document.getElementById('statMatches');
  const statInterests = document.getElementById('statInterests');

  if (profileName) profileName.textContent = `${CURRENT_USER.name}, ${CURRENT_USER.age}`;
  if (profileBio) profileBio.textContent = CURRENT_USER.bio;
  if (profileAvatar) profileAvatar.src = CURRENT_USER.avatar;

  // Show newcomer badge if applicable
  if (CURRENT_USER.isNewcomer && newcomerBadge) {
    newcomerBadge.classList.remove('hidden');
  }

  // Show interests
  if (interestsContainer) {
    interestsContainer.innerHTML = CURRENT_USER.interests.map(id => {
      const interest = AVAILABLE_INTERESTS.find(i => i.id === id);
      return interest ? `<span class="interest-tag">${interest.icon} ${interest.name}</span>` : '';
    }).join('');
  }

  // Show upcoming events
  const likedEventsList = MOCK_EVENTS.filter(e => LIKED_EVENTS.includes(e.id));

  if (upcomingEvents) {
    upcomingEvents.innerHTML = likedEventsList.map(event => `
      <div class="upcoming-event-item" onclick="showEventDetail(MOCK_EVENTS.find(e => e.id === ${event.id}))">
        <div>
          <div class="upcoming-event-name">${event.title}</div>
          <div class="upcoming-event-date">${formatDate(event.date)} • ${event.time}</div>
        </div>
        <div style="color: var(--accent);">→</div>
      </div>
    `).join('');

    if (likedEventsList.length === 0) {
      upcomingEvents.innerHTML = '<p style="color: var(--text-secondary);">No upcoming events</p>';
    }
  }

  // Update stats
  if (statEvents) statEvents.textContent = userLikes.length;
  if (statMatches) statMatches.textContent = MOCK_MATCHES.length;
  if (statInterests) statInterests.textContent = CURRENT_USER.interests.length;

  console.log('Profile loaded successfully');
}

// Ticket Functions
function showTicketModal(eventId) {
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  if (!event) return;

  document.getElementById('ticketEventInfo').innerHTML = `
    <h3>${event.title}</h3>
    <p>${formatDate(event.date)} • ${event.time}</p>
  `;
  document.getElementById('ticketTotal').textContent = event.price;
  document.getElementById('ticketModal').classList.remove('hidden');
  document.getElementById('eventModal').classList.add('hidden');
}

function closeTicketModal() {
  document.getElementById('ticketModal').classList.add('hidden');
}

function purchaseTicket() {
  alert('Ticket purchase successful! (Demo Mode)');
  closeTicketModal();
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('de-DE', options);
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
