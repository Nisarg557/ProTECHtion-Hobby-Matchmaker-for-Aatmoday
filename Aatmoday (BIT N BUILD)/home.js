// home.js
import { db, collection, getDocs } from './firebase.js';

// --- Configuration ---
let upcomingEvents = [];
let pastEvents = [];
let upcomingIndex = 0;
let pastIndex = 0;
const eventsPerRow = 3; 
const rotationTime = 10000; 

// --- Fetch and Initialize ---
async function fetchAndStartEvents() {
    try {
        // Fetch events from Firebase instead of the local JSON
        const querySnapshot = await getDocs(collection(db, "events"));
        const allEvents = [];
        
        querySnapshot.forEach((doc) => {
            allEvents.push(doc.data());
        });

        // Separate events into Upcoming and Past
        upcomingEvents = allEvents.filter(event => event.status === 'Upcoming');
        pastEvents = allEvents.filter(event => event.status === 'Past');

        renderEventBatch();

        // Only auto-rotate if we have more events than can fit in a single row
        if (upcomingEvents.length > eventsPerRow || pastEvents.length > eventsPerRow) {
            setInterval(rotateEvents, rotationTime);
        }

    } catch (error) {
        console.error("Error loading events from Firebase:", error);
        document.getElementById('upcoming-container').innerHTML = 
            "<p class='error-msg' style='color:red;'>Failed to load events. Check console for details.</p>";
    }
}

// --- Card Generator Helper ---
function createCardElement(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card scroll-reveal';
    card.style.transitionDelay = `${index * 0.08}s`;

    const statusClass = event.status ? event.status.toLowerCase() : 'upcoming';

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-header-row">
                <span class="club-tag">${event.clubName}</span>
                <span class="status-badge ${statusClass}">${event.status}</span>
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

    card.onclick = () => openModal(event);
    return card;
}

// --- Render the Split Batches ---
function renderEventBatch() {
    const upcomingContainer = document.getElementById('upcoming-container');
    const pastContainer = document.getElementById('past-container');
    
    upcomingContainer.innerHTML = ""; 
    pastContainer.innerHTML = ""; 

    if (upcomingEvents.length > 0) {
        for (let i = 0; i < Math.min(eventsPerRow, upcomingEvents.length); i++) {
            const ev = upcomingEvents[(upcomingIndex + i) % upcomingEvents.length];
            upcomingContainer.appendChild(createCardElement(ev, i));
        }
    } else {
        upcomingContainer.innerHTML = '<p style="color:#6b7280; font-size:14px; padding-left:10px;">No upcoming events.</p>';
    }

    if (pastEvents.length > 0) {
        for (let i = 0; i < Math.min(eventsPerRow, pastEvents.length); i++) {
            const ev = pastEvents[(pastIndex + i) % pastEvents.length];
            pastContainer.appendChild(createCardElement(ev, i));
        }
    } else {
        pastContainer.innerHTML = '<p style="color:#6b7280; font-size:14px; padding-left:10px;">No past events.</p>';
    }

    // Trigger fade-in instantly after appending
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('visible'));
    }, 50);
}

// --- Smooth Rotation Transition ---
function rotateEvents() {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
        card.classList.remove('visible');
        card.classList.add('fade-out');
    });

    setTimeout(() => {
        if (upcomingEvents.length > eventsPerRow) {
            upcomingIndex = (upcomingIndex + eventsPerRow) % upcomingEvents.length;
        }
        if (pastEvents.length > eventsPerRow) {
            pastIndex = (pastIndex + eventsPerRow) % pastEvents.length;
        }
        renderEventBatch();
    }, 600);
}

// --- Modal Controls ---
function openModal(event) {
    document.getElementById('modalTitle').textContent = event.eventName;
    
    document.getElementById('modalDetails').innerHTML = `
        <strong>${event.clubName}</strong> &nbsp;|&nbsp; 
        <span style="color: ${event.status === 'Upcoming' ? '#166534' : '#4b5563'};">${event.status}</span> <br><br>
        🕒 ${event.date} • ${event.time} <br> 📍 ${event.venue}
    `;
    
    document.getElementById('modalDescription').textContent = event.description;
    
    document.getElementById('eventModal').classList.add('show');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('eventModal').classList.remove('show');
    document.body.style.overflow = '';
}

// Ensure closing by clicking the background overlay works
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) closeModal();
}

// --- Bindings for Modules ---
document.addEventListener('DOMContentLoaded', fetchAndStartEvents);
window.closeModal = closeModal;