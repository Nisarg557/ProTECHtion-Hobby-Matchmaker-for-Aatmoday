// JSON Array representing our backend database of upcoming events
const eventsData = [
    {
        title: "Fall Coding Hackathon",
        date: "Oct 12",
        time: "9:00 AM",
        location: "Tech Center",
        description: "Join us for a 48-hour coding marathon. Food and drinks provided!"
    },
    {
        title: "Intramural Soccer Finals",
        date: "Oct 15",
        time: "6:00 PM",
        location: "Main Field",
        description: "Come cheer for the top two campus teams as they battle for the cup."
    },
    {
        title: "Art & Wine Mixer",
        date: "Oct 18",
        time: "7:00 PM",
        location: "Student Union",
        description: "A relaxed evening exploring the creative arts gallery with refreshments."
    },
    {
        title: "Finance Guest Speaker",
        date: "Oct 21",
        time: "4:00 PM",
        location: "Business Hall",
        description: "Learn about modern investing strategies from a Wall Street analyst."
    },
    // --- NEW EVENTS ADDED BELOW ---
    {
        title: "Annual Career Fair",
        date: "Oct 24",
        time: "10:00 AM",
        location: "Campus Arena",
        description: "Meet with over 50 top employers looking to hire for internships and full-time roles."
    },
    {
        title: "Movie on the Lawn",
        date: "Oct 27",
        time: "8:00 PM",
        location: "Quad Green",
        description: "Bring a blanket and enjoy a starlight screening of this year's biggest blockbuster."
    },
    {
        title: "International Food Fest",
        date: "Nov 2",
        time: "12:00 PM",
        location: "Main Courtyard",
        description: "Taste authentic dishes from over 20 different countries prepared by our student clubs."
    },
    {
        title: "Campus E-Sports Tourney",
        date: "Nov 5",
        time: "5:00 PM",
        location: "Gaming Lounge",
        description: "Compete in Smash Bros and Valorant for a chance to win the grand prize of $500."
    }
];

function displayEvents() {
    const container = document.getElementById('events-container');
    
    container.innerHTML = "";

    eventsData.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';

        card.innerHTML = `
            <h3>${event.title}</h3>
            <div class="event-details">
                🕒 ${event.date} @ ${event.time} | 📍 ${event.location}
            </div>
            <p>${event.description}</p>
        `;

        container.appendChild(card);
    });
}

window.onload = displayEvents;