// advisor.js
import { db, collection, getDocs } from './firebase.js';
import { GROQ_API_KEY } from './config.js';

let clubs = [];
let userSelections = {
    aboutYou: null,
    time: null,
    social: null,
    goals: []
};

// --- Fetch Live Firebase Data ---
async function loadData() {
    try {
        const [clubsSnapshot, eventsSnapshot] = await Promise.all([
            getDocs(collection(db, "clubs")),
            getDocs(collection(db, "events"))
        ]);

        const clubsData = [];
        clubsSnapshot.forEach(doc => clubsData.push({ id: doc.id, ...doc.data() }));

        const eventsData = [];
        eventsSnapshot.forEach(doc => eventsData.push(doc.data()));

        clubs = clubsData.map(club => {
            const clubName = club.name || club.title || "Unnamed Club";
            const clubDesc = club.description || club.desc || "";
            const clubEvents = eventsData.filter(e => e.clubName === clubName || e.clubId === club.id);
            const upcomingEvent = clubEvents.find(e => e.status === "Upcoming");
            
            const displayEvent = upcomingEvent 
                ? `${upcomingEvent.eventName} (${upcomingEvent.date})` 
                : (clubEvents.length > 0 ? clubEvents[0].eventName : "Stay tuned for upcoming activities!");

            return {
                id: club.id,
                name: clubName,
                description: clubDesc,
                icon: club.icon || '🎯',
                event: displayEvent
            };
        });
        console.log("Firebase data loaded for AI matching.");
    } catch (error) {
        console.error("Error loading Firebase data:", error);
    }
}

// --- UI Button Interactions ---
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

// --- Advanced AI Matchmaking Logic ---
async function findMatches() {
    if (clubs.length === 0) {
        alert("Data is still loading. Please try again in a moment.");
        return;
    }

    const interestInput = document.getElementById("interestInput").value.trim();
    const additional = document.getElementById("additionalInterests").value.trim();
    
    if (interestInput.length < 10) {
        alert("Please describe your interests a bit more so our AI can find a great match.");
        return;
    }

    const userProfile = `
        Free-form interest: "${interestInput}"
        Additional info: "${additional}"
        Personality: ${userSelections.aboutYou || "Not specified"}
        Time commitment: ${userSelections.time || "Not specified"}
        Social preference: ${userSelections.social || "Not specified"}
        Goals: ${userSelections.goals.join(", ") || "Not specified"}
    `;

    const loading = document.getElementById("loadingBox");
    loading.style.display = "block";
    document.getElementById("resultsSection").style.display = "none";

    try {
        const prompt = `
            You are an elite, highly precise AI Matchmaker for the Aatmoday student festival. 
            Analyze the user's profile against the available clubs.

            AVAILABLE CLUBS DATABASE:
            ${JSON.stringify(clubs)}

            USER PROFILE INPUTS:
            ${userProfile}

            STRICT RULES:
            1. RELEVANCE THRESHOLD: A club must share at least 50% overlap with the user's core interest.
            2. SUCCESS: Return a minimum of 3 relevant club matches if possible (or all available). Set status to "success".
            3. PARTIAL: If adjacent, return max 2 clubs, set status to "partial", and write a 'global_note'.
            4. NONE: If completely out of scope, return 0 matches, set status to "none".
            5. ICEBREAKER (CRITICAL): Every single match MUST include a precise, highly creative icebreaker question. The icebreaker MUST weave in the user's exact vocabulary, creative elements (like canvas, photos, website building, or coding), or specific words from their input text. Never leave it empty or generic.

            MANDATORY JSON OUTPUT SCHEMA:
            Return ONLY a raw JSON object with no markdown formatting. Follow this exact structure:
            {
                "status": "success" | "partial" | "none",
                "global_note": "Contextual message if partial or none. Empty string if success.",
                "matches": [
                    {
                        "id": "exact_club_id_from_database",
                        "percentage": 85,
                        "reason": "Precise, 1-sentence explanation of the alignment.",
                        "icebreaker": "Your custom conversational icebreaker utilizing their exact words here..."
                    }
                ]
            }
        `;

        const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Groq API rejected request:", data);
            alert(`API Error: ${data.error?.message || "Unknown error"}. Check console.`);
            loading.style.display = "none";
            return;
        }

        const aiResponseText = data.choices[0].message.content;
        const aiData = JSON.parse(aiResponseText);

        const finalMatches = (aiData.matches || []).map(aiMatch => {
            const fullClubInfo = clubs.find(c => c.id === aiMatch.id);
            if(!fullClubInfo) return null;
            return {
                ...fullClubInfo,
                score: aiMatch.percentage || 75,
                reason: aiMatch.reason || "Matched based on your profile interests.",
                icebreaker: aiMatch.icebreaker || "Hey! Saw your profile—how do you plan to showcase your projects?"
            };
        }).filter(match => match !== null);

        displayResults(aiData.status, aiData.global_note, finalMatches);
        
        loading.style.display = "none";
        const resultsSection = document.getElementById("resultsSection");
        resultsSection.style.display = "block";
        resultsSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("AI Matchmaking Error:", error);
        alert("Our AI is currently taking a break. Please try again in a moment.");
        loading.style.display = "none";
    }
}

// --- Render UI ---
function displayResults(status, globalNote, matches) {
    const container = document.getElementById("resultsContainer");
    const summary = document.getElementById("resultsSummary");
    container.innerHTML = "";
    
    if (status === "none" || matches.length === 0) {
        summary.innerHTML = `<strong style="color: var(--brand-red);">No exact matches found.</strong>`;
        container.innerHTML = `
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 12px; text-align: center; grid-column: 1 / -1;">
                <h3 style="color: #991b1b; margin-bottom: 10px;">Exploring New Horizons</h3>
                <p style="color: #7f1d1d; font-size: 15px; line-height: 1.6;">${globalNote || "We don't currently have a club that fits this specific interest."}</p>
            </div>
        `;
        return;
    }

    if (status === "partial") {
        summary.innerHTML = `<strong style="color: #d97706;">Alternative Recommendations:</strong> We found some adjacent communities that might interest you.`;
        
        const noteBox = document.createElement("div");
        noteBox.style = "background: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; grid-column: 1 / -1;";
        noteBox.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="font-size: 20px;">💡</span>
                <p style="color: #92400e; margin: 0; font-size: 14.5px; line-height: 1.5;">${globalNote}</p>
            </div>
        `;
        container.appendChild(noteBox);
    } else {
        summary.textContent = "Our AI analyzed your exact words to find your perfect communities.";
    }
    
    matches.forEach(club => {
        const card = document.createElement("div");
        card.className = "result-card";
        const clubURL = `club.html?id=${encodeURIComponent(club.id)}`;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="club-title">
                    <div class="club-icon">${club.icon || '🎯'}</div>
                    <h3>${club.name}</h3>
                </div>
                <div class="match-score">
                    ${club.score}%<br><small>Match</small>
                </div>
            </div>
            
            <div class="why-match">
                <h4>Why we picked this for you</h4>
                <p>${club.reason}</p>
            </div>
            
            <div class="icebreaker-box" style="background: rgba(217, 4, 41, 0.05); border-left: 3px solid var(--brand-red); padding: 12px 16px; margin: 15px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 6px 0; color: var(--brand-red); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">💬 Suggested Icebreaker</h4>
                <p style="margin: 0; font-style: italic; color: var(--text-dark); font-size: 14px;">"${club.icebreaker}"</p>
            </div>

            <div class="related-event">
                <h4>📅 Next Activity</h4>
                <p>${club.event}</p>
            </div>
            <a href="${clubURL}" class="learn-more">
                Learn More <span>→</span>
            </a>
        `;
        
        container.appendChild(card);
    });
}

// --- Event Listeners Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    loadData();

    document.querySelectorAll(".option-grid .option").forEach(button => {
        button.addEventListener("click", () => {
            const group = button.getAttribute("data-group");
            selectOption(button, group);
        });
    });

    document.querySelectorAll(".goal-options .goal").forEach(button => {
        button.addEventListener("click", () => {
            toggleGoal(button);
        });
    });

    const matchBtn = document.querySelector(".match-button");
    if (matchBtn) {
        matchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            findMatches();
        });
    }
});