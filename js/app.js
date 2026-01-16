// SceneLink App Logic - Extended Version with Groups

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
let currentGroup = null;
let userGroups = [...MOCK_GROUPS.slice(0, 3)]; // User starts with 3 groups for demo

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
  setupPrefButtons();
}

function showMainApp() {
  document.getElementById('onboardingFlow').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  initMainApp();
}

function nextOnboardingStep() {
  document.getElementById('onboardingWelcome').classList.remove('active');
  document.getElementById('onboardingProfile').classList.add('active');
}

function saveProfileAndContinue() {
  const name = document.getElementById('profileNameInput').value.trim();
  const age = parseInt(document.getElementById('profileAgeInput').value);
  const bio = document.getElementById('profileBioInput').value.trim();

  if (!name) {
    alert('Please enter your name');
    return;
  }
  if (!age || age < 18 || age > 99) {
    alert('Please enter a valid age (18-99)');
    return;
  }

  CURRENT_USER.name = name;
  CURRENT_USER.age = age;
  CURRENT_USER.bio = bio || 'Event enthusiast';
  CURRENT_USER.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

  document.getElementById('onboardingProfile').classList.remove('active');
  document.getElementById('onboardingNewcomer').classList.add('active');
}

function setNewcomer(isNewcomer) {
  CURRENT_USER.isNewcomer = isNewcomer;
  document.getElementById('onboardingNewcomer').classList.remove('active');
  document.getElementById('onboardingInterests').classList.add('active');
}

function renderInterestsGrid() {
  const grid = document.getElementById('interestsGrid');
  if (!grid) return;
  grid.innerHTML = AVAILABLE_INTERESTS.map(interest => `
    <button class="interest-btn" onclick="toggleInterest('${interest.id}', this)">
      <span class="interest-btn-icon">${interest.icon}</span>
      <span class="interest-btn-name">${interest.name}</span>
    </button>
  `).join('');
}

function toggleInterest(interestId, btnElement) {
  const index = CURRENT_USER.interests.indexOf(interestId);
  const btn = btnElement || document.querySelector(`[onclick*="${interestId}"]`);

  if (index > -1) {
    CURRENT_USER.interests.splice(index, 1);
    if (btn) btn.classList.remove('selected');
  } else {
    CURRENT_USER.interests.push(interestId);
    if (btn) btn.classList.add('selected');
  }

  updateInterestCounter();
}

function updateInterestCounter() {
  const count = CURRENT_USER.interests.length;
  const countEl = document.getElementById('selectedCount');
  const continueBtn = document.getElementById('continueInterests');
  if (countEl) countEl.textContent = count;
  if (continueBtn) continueBtn.disabled = count < 3;
}

function goToMatchPreferences() {
  document.getElementById('onboardingInterests').classList.remove('active');
  document.getElementById('onboardingMatchPrefs').classList.add('active');
}

function skipInterests() {
  CURRENT_USER.interests = ['musik', 'kunst', 'food']; // Default interests
  goToMatchPreferences();
}

function setupPrefButtons() {
  // Setup preference button click handlers
  const prefContainers = ['peopleTypeOptions', 'vibeOptions', 'groupSizeOptions'];

  prefContainers.forEach(containerId => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.querySelectorAll('.pref-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove selected from siblings
        container.querySelectorAll('.pref-btn').forEach(b => b.classList.remove('selected'));
        // Add selected to clicked
        btn.classList.add('selected');
      });
    });
  });
}

function saveMatchPreferences() {
  const ageMin = parseInt(document.getElementById('prefAgeMin').value) || 18;
  const ageMax = parseInt(document.getElementById('prefAgeMax').value) || 35;

  const peopleType = document.querySelector('#peopleTypeOptions .pref-btn.selected')?.dataset.value || 'open';
  const vibe = document.querySelector('#vibeOptions .pref-btn.selected')?.dataset.value || 'chill';
  const groupSize = document.querySelector('#groupSizeOptions .pref-btn.selected')?.dataset.value || 'medium';

  CURRENT_USER.matchPreferences = {
    ageMin: Math.min(ageMin, ageMax),
    ageMax: Math.max(ageMin, ageMax),
    peopleType,
    vibe,
    groupSize
  };
}

function completeOnboarding() {
  saveMatchPreferences();
  CURRENT_USER.hasCompletedOnboarding = true;
  localStorage.setItem('onboarding_completed', 'true');
  localStorage.setItem('current_user', JSON.stringify(CURRENT_USER));
  showMainApp();
}

function skipOnboarding() {
  CURRENT_USER.name = 'Guest';
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
  loadGroups();
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

  // Group notification listeners
  const keepSwipingBtn = document.getElementById('keepSwipingBtn');
  const openGroupChatBtn = document.getElementById('openGroupChatBtn');

  if (keepSwipingBtn) {
    keepSwipingBtn.addEventListener('click', () => {
      document.getElementById('groupNotification').classList.add('hidden');
    });
  }

  if (openGroupChatBtn) {
    openGroupChatBtn.addEventListener('click', () => {
      document.getElementById('groupNotification').classList.add('hidden');
      if (userGroups.length > 0) {
        openGroupChat(userGroups[0]);
      }
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

  // Tabs in Groups View
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadGroups(tab.dataset.tab);
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
        loadGroups();
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

    // Check for interest match and random chance (50%) to join a group
    const hasCommonInterests = currentEvent.interests.some(i => CURRENT_USER.interests.includes(i));
    if (hasCommonInterests && Math.random() < 0.5) {
      setTimeout(() => showGroupNotification(currentEvent), 500);
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

// Show Group Notification - User joins a group for this event
function showGroupNotification(event) {
  // Find existing group for this event or create new one
  let group = MOCK_GROUPS.find(g => g.event.id === event.id);

  if (!group) {
    // Create a new group with random members
    const shuffledUsers = [...MOCK_USERS].sort(() => Math.random() - 0.5);
    const groupSize = Math.floor(Math.random() * 4) + 4; // 4-7 members
    const members = shuffledUsers.slice(0, groupSize);

    group = {
      id: Date.now(),
      name: generateGroupName(event),
      event: event,
      members: members,
      createdAt: new Date().toISOString(),
      isNew: true,
      commonInterests: event.interests,
      messages: [
        { userId: members[0].id, text: `Excited for ${event.title}!`, time: 'Just now' }
      ]
    };
    MOCK_GROUPS.unshift(group);
  }

  // Add to user's groups
  if (!userGroups.find(g => g.id === group.id)) {
    group.isNew = true;
    userGroups.unshift(group);
  }

  // Show notification
  const avatarsHtml = group.members.slice(0, 5).map(m =>
    `<img src="${m.avatar}" alt="${m.name}">`
  ).join('');

  document.getElementById('groupAvatarsPreview').innerHTML = avatarsHtml;
  document.getElementById('groupNamePreview').textContent = group.name;
  document.getElementById('groupMembersPreview').textContent = group.members.length;
  document.getElementById('groupEventPreview').textContent = event.title;

  const commonInterestsHtml = group.commonInterests.map(id => {
    const interest = AVAILABLE_INTERESTS.find(i => i.id === id);
    return interest ? `<span class="common-interest-tag">${interest.icon} ${interest.name}</span>` : '';
  }).join('');

  document.getElementById('commonInterestsGroup').innerHTML = commonInterestsHtml;
  document.getElementById('groupNotification').classList.remove('hidden');
}

// Generate a fun group name based on event
function generateGroupName(event) {
  const prefixes = ['The', 'Team', 'Squad', 'Crew', 'Gang'];
  const suffixes = {
    'konzert': ['Music Lovers', 'Sound Seekers', 'Melody Makers'],
    'kunst': ['Art Explorers', 'Creative Minds', 'Culture Club'],
    'sport': ['Active Squad', 'Fitness Crew', 'Movement Gang'],
    'food': ['Foodies United', 'Taste Hunters', 'Flavor Squad'],
    'party': ['Party People', 'Night Owls', 'Vibe Tribe'],
    'workshop': ['Learners Club', 'Skill Builders', 'Workshop Warriors'],
    'outdoor': ['Nature Lovers', 'Adventure Crew', 'Outdoor Gang'],
    'community': ['Community Crew', 'Social Squad', 'Together Team']
  };

  const categoryOptions = suffixes[event.category] || ['Event Crew', 'Fun Group', 'Adventure Squad'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];

  return `${prefix} ${suffix}`;
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

// Load Groups
function loadGroups(filter = 'all') {
  const groupsList = document.getElementById('groupsList');
  if (!groupsList) return;

  groupsList.innerHTML = '';

  let filteredGroups = userGroups;

  if (filter === 'new') {
    filteredGroups = userGroups.filter(g => g.isNew);
  } else if (filter === 'upcoming') {
    const today = new Date();
    filteredGroups = userGroups.filter(g => new Date(g.event.date) > today);
  }

  // Update tab counts
  const tabCounts = document.querySelectorAll('.tab-count');
  if (tabCounts[0]) tabCounts[0].textContent = userGroups.length;
  if (tabCounts[1]) tabCounts[1].textContent = userGroups.filter(g => g.isNew).length;
  if (tabCounts[2]) tabCounts[2].textContent = userGroups.filter(g => new Date(g.event.date) > new Date()).length;

  filteredGroups.forEach(group => {
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card' + (group.isNew ? ' new' : '');

    // Generate avatar stack HTML
    const avatarsHtml = group.members.slice(0, 3).map(m =>
      `<img src="${m.avatar}" alt="${m.name}">`
    ).join('');

    const moreCount = group.members.length > 3 ? group.members.length - 3 : 0;
    const moreHtml = moreCount > 0 ? `<span class="more-members">+${moreCount}</span>` : '';

    // Get last message
    const lastMsg = group.messages[group.messages.length - 1];
    const lastMsgUser = MOCK_USERS.find(u => u.id === lastMsg?.userId);

    groupCard.innerHTML = `
      <div class="group-header">
        <div class="group-avatars">
          ${avatarsHtml}
          ${moreHtml}
        </div>
        <div class="group-info">
          <div class="group-name">${group.name}</div>
          <div class="group-event">📍 ${group.event.title}</div>
          <div class="group-members-count">👥 ${group.members.length} members</div>
        </div>
      </div>
      ${lastMsg ? `
        <div class="group-last-message">
          <div class="group-message-preview">
            <span class="group-message-author">${lastMsgUser?.name || 'Someone'}:</span>
            <span>${lastMsg.text}</span>
          </div>
          <div class="group-message-time">${lastMsg.time}</div>
        </div>
      ` : ''}
    `;

    groupCard.addEventListener('click', () => openGroupChat(group));
    groupsList.appendChild(groupCard);
  });

  if (filteredGroups.length === 0) {
    groupsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No groups yet. Swipe right on events to join groups!</p>';
  }
}

// Group Chat Functions
function openGroupChat(group) {
  currentGroup = group;
  group.isNew = false; // Mark as seen

  // Update chat header
  const avatarsHtml = group.members.slice(0, 3).map(m =>
    `<img src="${m.avatar}" alt="${m.name}">`
  ).join('');

  document.getElementById('chatGroupAvatars').innerHTML = avatarsHtml;
  document.getElementById('chatGroupName').textContent = group.name;
  document.getElementById('chatGroupEvent').textContent = group.event.title;
  document.getElementById('chatGroupMembers').textContent = `${group.members.length} members`;

  // Load chat messages
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = '';

  group.messages.forEach(msg => {
    const sender = MOCK_USERS.find(u => u.id === msg.userId);
    const isCurrentUser = msg.userId === CURRENT_USER.id;

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${isCurrentUser ? 'sent' : 'received'}`;
    messageEl.innerHTML = `
      ${!isCurrentUser ? `<div class="chat-sender">${sender?.name || 'Unknown'}</div>` : ''}
      <div>${msg.text}</div>
      <div class="chat-time">${msg.time}</div>
    `;
    messagesContainer.appendChild(messageEl);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Switch to chat view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('chatView').classList.add('active');
}

function closeChat() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('matchesView').classList.add('active');
  loadGroups(); // Refresh groups to update "new" badges
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (!message || !currentGroup) return;

  // Add message to group
  const newMsg = {
    userId: CURRENT_USER.id,
    text: message,
    time: 'Just now'
  };
  currentGroup.messages.push(newMsg);

  // Add to UI
  const messagesContainer = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message sent';
  messageEl.innerHTML = `
    <div>${message}</div>
    <div class="chat-time">Just now</div>
  `;

  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  input.value = '';

  // Simulate a reply after 2 seconds (for demo)
  setTimeout(() => {
    simulateGroupReply();
  }, 2000);
}

function simulateGroupReply() {
  if (!currentGroup) return;

  const randomMember = currentGroup.members[Math.floor(Math.random() * currentGroup.members.length)];
  const replies = [
    "Sounds great! 🎉",
    "Can't wait!",
    "See you there!",
    "Awesome! 👍",
    "Perfect, I'm in!",
    "Let's do this!"
  ];
  const randomReply = replies[Math.floor(Math.random() * replies.length)];

  const newMsg = {
    userId: randomMember.id,
    text: randomReply,
    time: 'Just now'
  };
  currentGroup.messages.push(newMsg);

  const messagesContainer = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = 'chat-message received';
  messageEl.innerHTML = `
    <div class="chat-sender">${randomMember.name}</div>
    <div>${randomReply}</div>
    <div class="chat-time">Just now</div>
  `;

  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Group Info Modal
function showGroupInfo() {
  if (!currentGroup) return;

  document.getElementById('groupInfoName').textContent = currentGroup.name;
  document.getElementById('groupInfoEvent').innerHTML = `
    📍 ${currentGroup.event.title}<br>
    📅 ${formatDate(currentGroup.event.date)} • ${currentGroup.event.time}<br>
    📍 ${currentGroup.event.location}
  `;
  document.getElementById('groupMemberCount').textContent = currentGroup.members.length;

  // Render members list
  const membersList = document.getElementById('groupMembersList');
  membersList.innerHTML = currentGroup.members.map(member => `
    <div class="member-item">
      <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
      <div class="member-info">
        <div class="member-name">${member.name}, ${member.age}</div>
        <div class="member-bio">${member.bio}</div>
      </div>
    </div>
  `).join('');

  // Render common interests
  const commonInterestsHtml = currentGroup.commonInterests.map(id => {
    const interest = AVAILABLE_INTERESTS.find(i => i.id === id);
    return interest ? `<span class="common-interest-tag">${interest.icon} ${interest.name}</span>` : '';
  }).join('');
  document.getElementById('groupCommonInterests').innerHTML = commonInterestsHtml;

  document.getElementById('groupInfoModal').classList.remove('hidden');
}

function closeGroupInfo() {
  document.getElementById('groupInfoModal').classList.add('hidden');
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
  if (statMatches) statMatches.textContent = userGroups.length; // Now shows groups instead of matches
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
