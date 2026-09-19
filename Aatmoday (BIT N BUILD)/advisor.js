const interestConcepts = {
    photography: { label: "Photography", aliases: ["photo", "photos", "photograph", "photographs", "photography", "camera", "cameras", "photographer", "photographers", "dslr"] },
    creativity: { label: "Creativity", aliases: ["creative", "creativity", "creative work", "creative content", "artistic", "art", "arts"] },
    visualStorytelling: { label: "Visual Storytelling", aliases: ["visual storytelling", "visual story", "visual content"] },
    video: { label: "Video & Content", aliases: ["video", "videos", "videography", "editing", "video editing", "content creation", "content"] },
    coding: { label: "Coding & Programming", aliases: ["code", "coding", "programming", "programmer", "developer", "development", "software", "software development", "web development", "app development"] },
    technology: { label: "Technology", aliases: ["technology", "tech", "computer", "computers", "digital"] },
    robotics: { label: "Robotics", aliases: ["robot", "robots", "robotics", "arduino", "electronics", "hardware"] },
    artificialIntelligence: { label: "Artificial Intelligence", aliases: ["ai", "artificial intelligence", "machine learning", "ml", "deep learning"] },
    reading: { label: "Reading", aliases: ["read", "reading", "book", "books", "novel", "novels"] },
    writing: { label: "Writing", aliases: ["write", "writing", "writer", "writers", "story", "stories", "creative writing"] },
    poetry: { label: "Poetry", aliases: ["poetry", "poem", "poems"] },
    literature: { label: "Literature", aliases: ["literature", "literary", "literary work"] },
    debate: { label: "Debate & Discussion", aliases: ["debate", "debating", "discussion", "discussions", "public speaking", "speaking"] },
    fitness: { label: "Fitness", aliases: ["fitness", "fit", "exercise", "workout", "workouts", "training", "physical fitness"] },
    sports: { label: "Sports", aliases: ["sport", "sports", "athletics", "athletic", "running", "run", "football", "cricket", "basketball", "badminton"] },
    yoga: { label: "Yoga & Wellness", aliases: ["yoga", "meditation", "wellness", "mindfulness"] },
    cooking: { label: "Cooking", aliases: ["cook", "cooking", "food", "foods", "recipe", "recipes", "kitchen", "culinary", "chef"] },
    baking: { label: "Baking", aliases: ["baking", "bake", "cakes", "cake", "pastry", "desserts"] },
    gardening: { label: "Gardening", aliases: ["garden", "gardening", "gardener", "plant", "plants", "planting"] },
    nature: { label: "Nature", aliases: ["nature", "natural", "outdoor", "outdoors", "environment", "environmental", "green"] },
    sustainability: { label: "Sustainability", aliases: ["sustainability", "sustainable", "eco friendly", "eco-friendly", "recycling", "conservation"] },
    culture: { label: "Culture", aliases: ["culture", "cultural", "tradition", "traditional", "festival", "festivals"] },
    music: { label: "Music", aliases: ["music", "musical", "singing", "song", "songs", "instrument", "instruments", "guitar", "piano"] },
    dance: { label: "Dance", aliases: ["dance", "dancing", "choreography"] },
    performance: { label: "Performance", aliases: ["performance", "performing", "acting", "theatre", "theater", "stage"] }
};

// Map club IDs to matching concepts since this data isn't in club.json
const clubConceptsMapping = {
    "photography": ["photography", "creativity", "visualStorytelling", "video"],
    "coding": ["coding", "technology", "robotics", "artificialIntelligence"],
    "cultural": ["culture", "creativity", "music", "dance", "performance"],
    "literary": ["reading", "writing", "poetry", "literature", "debate"],
    "fitness": ["fitness", "sports", "yoga"],
    "cooking": ["cooking", "baking"],
    "gardening": ["gardening", "nature", "sustainability"],
    "music": ["music", "performance", "creativity"],
    "art": ["creativity", "visualStorytelling", "technology"],
    "astronomy": ["technology", "nature", "photography"],
    "cinema": ["video", "visualStorytelling", "performance", "creativity"],
    "business": ["debate", "technology", "reading"]
};

let clubs = [];
let userSelections = {
    aboutYou: null,
    time: null,
    social: null,
    goals: []
};

// Fetch data from JSON files and initialize clubs array
async function loadData() {
    try {
        const [clubsResponse, eventsResponse] = await Promise.all([
            fetch('club.json'),
            fetch('event.json')
        ]);

        const clubsData = await clubsResponse.json();
        const eventsData = await eventsResponse.json();

        clubs = clubsData.map(club => {
            // Find the most relevant upcoming event for this club
            const clubEvents = eventsData.filter(e => e.clubName === club.name);
            const upcomingEvent = clubEvents.find(e => e.status === "Upcoming");
            
            // Fallback to a past event if no upcoming events exist, or a default string
            const displayEvent = upcomingEvent 
                ? `${upcomingEvent.eventName} (${upcomingEvent.date})` 
                : (clubEvents.length > 0 ? clubEvents[0].eventName : "Stay tuned for upcoming activities!");

            return {
                ...club,
                concepts: clubConceptsMapping[club.id] || [],
                event: displayEvent
            };
        });
        console.log("Data successfully loaded from JSON files.");
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

function selectOption(button, group) {
    const buttons = document.querySelectorAll(`[data-group="${group}"]`);
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    userSelections[group] = button.dataset.value;
}

function toggleGoal(button) {
    const goal = button.dataset.goal;
    if (button.classList.contains("selected")) {
        button.classList.remove("selected");
        userSelections.goals = userSelections.goals.filter(item => item !== goal);
        return;
    }

    if (userSelections.goals.length >= 3) {
        alert("You can select up to 3 goals.");
        return;
    }
    
    button.classList.add("selected");
    userSelections.goals.push(goal);
}

function normalizeText(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function containsTerm(text, term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "i");
    return regex.test(text);
}

function detectConcepts(text) {
    const normalized = normalizeText(text);
    const detected = [];
    
    Object.entries(interestConcepts).forEach(([conceptId, concept]) => {
        const matched = concept.aliases.some(alias => containsTerm(normalized, normalizeText(alias)));
        if (matched) {
            detected.push(conceptId);
        }
    });
    
    return detected;
}

function findMatches() {
    if (clubs.length === 0) {
        alert("Data is still loading. Please try again in a moment.");
        return;
    }

    const interestInput = document.getElementById("interestInput").value.trim();
    const additional = document.getElementById("additionalInterests").value.trim();
    
    if (interestInput.length < 10) {
        alert("Please tell us a little more about your interests.");
        return;
    }
    if (!userSelections.aboutYou) {
        alert("Please select which option best describes you.");
        return;
    }
    if (!userSelections.time) {
        alert("Please select how much time you can usually give.");
        return;
    }
    if (!userSelections.social) {
        alert("Please select how you prefer working on your interests.");
        return;
    }

    const fullText = `${interestInput} ${additional}`;
    const detectedConcepts = detectConcepts(fullText);
    const loading = document.getElementById("loadingBox");
    
    loading.style.display = "block";

    setTimeout(() => {
        const results = clubs.map(club => scoreClub(club, detectedConcepts));
        results.sort((a, b) => b.score - a.score);
        
        const topMatches = results.slice(0, 3);
        
        displayInterestProfile(detectedConcepts);
        displayResults(topMatches);
        
        loading.style.display = "none";
        
        const resultsSection = document.getElementById("resultsSection");
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth" });
    }, 900);
}

function scoreClub(club, detectedConcepts) {
    let score = 0;
    const matchedConcepts = [];
    
    club.concepts.forEach(conceptId => {
        if (detectedConcepts.includes(conceptId)) {
            score += 10;
            matchedConcepts.push(conceptId);
        }
    });
    
    if (userSelections.social === "small") score += 2;
    if (userSelections.social === "large") score += 3;
    
    userSelections.goals.forEach(goal => {
        if (goal === "skills") score += 2;
        if (goal === "people") score += 2;
        if (goal === "events") score += 2;
        if (goal === "hobbies") score += 2;
        if (goal === "portfolio") {
            if (club.id === "coding" || club.id === "photography" || club.id === "literary") {
                score += 3;
            }
        }
    });
    
    if (userSelections.time === "active") score += 2;

    return {
        ...club,
        score,
        matchedConcepts
    };
}

function displayInterestProfile(conceptIds) {
    const container = document.getElementById("interestProfile");
    const labels = conceptIds.map(id => interestConcepts[id].label);
    
    if (labels.length === 0) {
        container.innerHTML = `
            <h3>🧠 What we understood from you</h3>
            <p style="color:#667085; font-size:12px;">
                We couldn't identify specific hobby keywords, 
                so your preferences will be used to explore suitable communities.
            </p>
        `;
        return;
    }
    
    container.innerHTML = `
        <h3>🧠 What we understood from you</h3>
        <div class="interest-tags">
            ${labels.map(label => `<span class="interest-tag">${label}</span>`).join("")}
        </div>
    `;
}

function displayResults(matches) {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";
    document.getElementById("resultsSummary").textContent = "These recommendations are based on your interests, preferences and goals.";
    
    const highestScore = Math.max(...matches.map(club => club.score));
    
    matches.forEach(club => {
        let percentage;
        if (highestScore <= 0) {
            percentage = 55;
        } else {
            percentage = Math.round(60 + (club.score / highestScore) * 35);
        }
        
        percentage = Math.min(98, Math.max(55, percentage));
        
        const matchedLabels = club.matchedConcepts.map(conceptId => interestConcepts[conceptId].label).slice(0, 3);
        const tagsHTML = matchedLabels.length > 0
            ? matchedLabels.map(label => `<span class="matched-interest">${label}</span>`).join("")
            : `<span class="matched-interest">Preference Match</span>`;
            
        const card = document.createElement("div");
        card.className = "result-card";
        
        const clubURL = `club.html?id=${encodeURIComponent(club.id)}`;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="club-title">
                    <div class="club-icon">${club.icon}</div>
                    <h3>${club.name}</h3>
                </div>
                <div class="match-score">
                    ${percentage}%<br><small>Match</small>
                </div>
            </div>
            <div class="matched-interests">
                ${tagsHTML}
            </div>
            <div class="why-match">
                <h4>About this match</h4>
                <p>${club.description}</p>
            </div>
            <div class="related-event">
                <h4>📅 Related Aatmoday Activity</h4>
                <p>${club.event}</p>
            </div>
            <a href="${clubURL}" class="learn-more">
                Learn More <span>→</span>
            </a>
        `;
        
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Aatmoday Matchmaker loaded.");
    loadData();
});