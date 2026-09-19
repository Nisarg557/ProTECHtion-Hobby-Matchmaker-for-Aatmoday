// club.js
let globalUpcoming = [];
let globalPast = [];
let upcomingIndex = 0;
let pastIndex = 0;
const eventsPerPage = 2; 
const rotationTime = 5000; 
let rotationInterval = null;
let carouselInterval = null;

document.addEventListener('DOMContentLoaded', initializeClubPage);

async function initializeClubPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get('id');

    if (!clubId) {
        document.getElementById('club-content').innerHTML = '<h2>Club not found. Please return to the directory.</h2>';
        return;
    }

    try {
        const [clubsResponse, eventsResponse] = await Promise.all([
            fetch('club.json'),
            fetch('event.json')
        ]);
        
        const clubsData = await clubsResponse.json();
        const eventsData = await eventsResponse.json();

        const clubInfo = clubsData.find(c => c.id === clubId);

        if (!clubInfo) {
            document.getElementById('club-content').innerHTML = '<h2>Club details are currently unavailable.</h2>';
            return;
        }

        globalUpcoming = eventsData.filter(e => e.clubName === clubInfo.name && e.status === "Upcoming");
        globalPast = eventsData.filter(e => e.clubName === clubInfo.name && e.status === "Past");

        if (globalUpcoming.length === 0 && globalPast.length === 0) {
            globalUpcoming = [
                {
                    eventName: `${clubInfo.name} Launch Meetup`,
                    clubName: clubInfo.name,
                    date: "Nov 25, 2026",
                    time: "4:00 PM",
                    venue: "Main Campus Hall",
                    status: "Upcoming",
                    description: `Join us for our introductory session and get to know what ${clubInfo.name} has planned for the semester.`
                }
            ];
            globalPast = [
                {
                    eventName: `Orientation & Introductory Workshop`,
                    clubName: clubInfo.name,
                    date: "Jul 15, 2026",
                    time: "3:00 PM",
                    venue: "Activity Center",
                    status: "Past",
                    description: `An introductory session welcoming new members and covering foundational concepts.`
                }
            ];
        }

        renderClubPage(clubInfo);
        updateEventBatches();
        initAutoCarousel();

        if (globalUpcoming.length > eventsPerPage || globalPast.length > eventsPerPage) {
            if (rotationInterval) clearInterval(rotationInterval);
            rotationInterval = setInterval(rotateClubEvents, rotationTime);
        }

    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('club-content').innerHTML = `
            <div style="text-align: center; color: var(--brand-red); padding: 40px;">
                <h2>Error Loading Data</h2>
                <p>Ensure you are running a local server (e.g., Live Server) and that data files exist.</p>
            </div>
        `;
    }
}

function renderClubPage(club) {
    const content = document.getElementById('club-content');
    
    const execsHTML = club.executives.map(exec => 
        `<li><strong>${exec.name}</strong> - ${exec.designation}<br>
        <small>${exec.department} | ${exec.contact}</small></li>`
    ).join('');

    const activitiesHTML = club.activities.map(act => `<li>${act}</li>`).join('');

    // Use club specific images from json or fallback if missing
    const clubImages = club.images && club.images.length > 0 ? club.images : [
        `https://picsum.photos/seed/${club.id}1/1000/400`,
        `https://picsum.photos/seed/${club.id}2/1000/400`,
        `https://picsum.photos/seed/${club.id}3/1000/400`
    ];

    const slidesHTML = clubImages.map((imgSrc, index) => `
        <div class="carousel-slide"><img src="${imgSrc}" alt="${club.name} Activity ${index + 1}"></div>
    `).join('');

    const indicatorsHTML = clubImages.map((_, index) => `
        <span class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    content.innerHTML = `
        <div class="club-header">
            <h1>${club.icon} ${club.name}</h1>
            <p>${club.description}</p>
        </div>

        <!-- Rolling Photo Carousel Box with Dynamic Indicators -->
        <div class="carousel-container">
            <div class="carousel-track" id="carouselTrack">
                ${slidesHTML}
            </div>
            <div class="carousel-indicators" id="carouselIndicators">
                ${indicatorsHTML}
            </div>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h2>About the Club</h2>
                <p>${club.about}</p>
                <h3 style="margin-top:20px; margin-bottom: 10px;">Typical Activities</h3>
                <ul style="margin-left: 20px; line-height: 1.6; color: var(--text-muted);">
                    ${activitiesHTML}
                </ul>
            </div>
            
            <div class="info-section">
                <h2>Club Executives</h2>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 15px;">
                    ${execsHTML}
                </ul>
            </div>
        </div>

        <div class="info-section">
            <h2>Club Events</h2>
            <div class="events-container">
                <div>
                    <h3 style="margin-bottom: 15px; color: var(--brand-red);">Upcoming Events</h3>
                    <div id="club-upcoming-container" style="display: flex; flex-direction: column; gap: 15px;"></div>
                </div>
                <div>
                    <h3 style="margin-bottom: 15px;">Previous Events</h3>
                    <div id="club-past-container" style="display: flex; flex-direction: column; gap: 15px;"></div>
                </div>
            </div>
        </div>

        <div class="enroll-bar">
            <button class="btn-primary" onclick="openModal('${club.id}', '${club.name}')">Enroll Now</button>
        </div>
    `;
}

function initAutoCarousel() {
    const track = document.getElementById('carouselTrack');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!track || !indicatorsContainer) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const dots = indicatorsContainer.querySelectorAll('.carousel-dot');
    if (slides.length <= 1) return;

    let currentSlide = 0;

    function updateCarousel(index) {
        currentSlide = index;
        slides[currentSlide].scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });

        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach((dot, idx) => {
        dot.onclick = () => {
            if (carouselInterval) clearInterval(carouselInterval);
            updateCarousel(idx);
            initAutoCarousel(); 
        };
    });

    if (carouselInterval) clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel(currentSlide);
    }, 4000); 
}

function createClubEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card scroll-reveal';
    card.style.transitionDelay = `${index * 0.08}s`;

    const statusClass = event.status ? event.status.toLowerCase() : 'upcoming';

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-header-row">
                <span class="club-tag">${event.clubName}</span>
                <span class="status-badge ${statusClass}">${event.status || 'Upcoming'}</span>
            </div>
            
            <h3>${event.eventName}</h3>
            
            <div class="event-meta">
                <span class="icon">🕒</span> ${event.date} @ ${event.time}
            </div>
            <div class="event-meta">
                <span class="icon">📍</span> ${event.venue}
            </div>
            
            <div class="card-footer">
                <span>Read full details</span>
                <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </div>
        </div>
    `;

    card.onclick = () => openEventModal(event);
    return card;
}

function updateEventBatches() {
    const upcomingContainer = document.getElementById('club-upcoming-container');
    const pastContainer = document.getElementById('club-past-container');
    
    if (!upcomingContainer || !pastContainer) return;

    upcomingContainer.innerHTML = "";
    pastContainer.innerHTML = "";

    if (globalUpcoming.length > 0) {
        for (let i = 0; i < Math.min(eventsPerPage, globalUpcoming.length); i++) {
            const ev = globalUpcoming[(upcomingIndex + i) % globalUpcoming.length];
            upcomingContainer.appendChild(createClubEventCard(ev, i));
        }
    } else {
        upcomingContainer.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">No upcoming events currently scheduled.</p>';
    }

    if (globalPast.length > 0) {
        for (let i = 0; i < Math.min(eventsPerPage, globalPast.length); i++) {
            const ev = globalPast[(pastIndex + i) % globalPast.length];
            pastContainer.appendChild(createClubEventCard(ev, i));
        }
    } else {
        pastContainer.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">No past events recorded.</p>';
    }

    setTimeout(() => {
        document.querySelectorAll('.club-details-container .scroll-reveal').forEach(el => el.classList.add('visible'));
    }, 50);
}

function rotateClubEvents() {
    const cards = document.querySelectorAll('.club-details-container .event-card');
    
    cards.forEach(card => {
        card.classList.remove('visible');
        card.classList.add('fade-out');
    });

    setTimeout(() => {
        if (globalUpcoming.length > eventsPerPage) {
            upcomingIndex = (upcomingIndex + eventsPerPage) % globalUpcoming.length;
        }
        if (globalPast.length > eventsPerPage) {
            pastIndex = (pastIndex + eventsPerPage) % globalPast.length;
        }
        updateEventBatches();
    }, 400);
}

function openEventModal(event) {
    let modalOverlay = document.getElementById('eventModal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'eventModal';
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="closeEventModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
                <div class="modal-header-accent"></div>
                <h2 id="modalTitle"></h2>
                <div class="modal-meta" id="modalDetails"></div>
                <div class="modal-body-scroll">
                    <p id="modalDescription"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) closeEventModal();
        };
    }

    document.getElementById('modalTitle').textContent = event.eventName;
    document.getElementById('modalDetails').innerHTML = `
        <strong>${event.clubName}</strong> &nbsp;|&nbsp; 
        <span style="color: ${event.status === 'Upcoming' ? '#166534' : '#4b5563'};">${event.status || 'Event'}</span> <br><br>
        🕒 ${event.date} • ${event.time} <br> 📍 ${event.venue}
    `;
    document.getElementById('modalDescription').textContent = event.description;
    
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function openModal(clubId, clubName) {
    const modal = document.getElementById('enroll-modal');
    document.getElementById('enroll-club-id').value = clubId;
    document.getElementById('modal-club-name-display').innerText = clubName;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('enroll-modal').style.display = 'none';
}

function submitForm(event) {
    event.preventDefault();
    const clubId = document.getElementById('enroll-club-id').value;
    const name = document.getElementById('student-name').value;
    
    alert(`Success! Application submitted for ${name} to join club ID: ${clubId}.`);
    closeModal();
    event.target.reset();
}

window.onclick = function(event) {
    const enrollModal = document.getElementById('enroll-modal');
    if (event.target === enrollModal) {
        closeModal();
    }
}