
import { db, collection, getDocs } from './firebase.js';
import { GROQ_API_KEY } from './config.js';




let clubs = [];

let userSelections = {
    aboutYou: null,
    time: null,
    social: null,
    goals: []
};


// ============================================================
// MATCHING KNOWLEDGE BASE
// ============================================================
// These aliases help the system understand natural language.
// Example:
// "clicking pictures" -> photography
// "building websites" -> coding/web development
// "drawing" -> art/design
// ============================================================

const SEMANTIC_GROUPS = {

    photography: [
        "photo",
        "photos",
        "photography",
        "photographer",
        "camera",
        "cameras",
        "pictures",
        "picture",
        "clicking",
        "click",
        "shoot",
        "shooting",
        "portrait",
        "portraits",
        "landscape",
        "visual",
        "visuals",
        "editing",
        "lightroom",
        "dslr",
        "mirrorless",
        "composition",
        "street photography"
    ],

    art: [
        "art",
        "artist",
        "drawing",
        "draw",
        "painting",
        "paint",
        "sketch",
        "sketching",
        "canvas",
        "creative",
        "creativity",
        "illustration",
        "illustrations",
        "design",
        "designer",
        "graphic",
        "graphics",
        "craft",
        "crafting",
        "diy",
        "visual art"
    ],

    coding: [
        "code",
        "coding",
        "programming",
        "program",
        "developer",
        "development",
        "software",
        "website",
        "websites",
        "web development",
        "html",
        "css",
        "javascript",
        "java",
        "cpp",
        "c++",
        "python",
        "app",
        "apps",
        "application",
        "technology",
        "tech",
        "computer",
        "computers",
        "algorithm",
        "algorithms",
        "github",
        "frontend",
        "backend",
        "full stack",
        "fullstack"
    ],

    robotics: [
        "robot",
        "robots",
        "robotics",
        "arduino",
        "raspberry pi",
        "electronics",
        "electronic",
        "hardware",
        "automation",
        "iot",
        "embedded",
        "machine",
        "machines",
        "engineering",
        "technology",
        "tech"
    ],

    music: [
        "music",
        "musical",
        "sing",
        "singing",
        "singer",
        "song",
        "songs",
        "guitar",
        "piano",
        "keyboard",
        "drums",
        "drummer",
        "instrument",
        "instruments",
        "vocal",
        "vocals",
        "band",
        "bands",
        "acoustic",
        "melody",
        "rhythm",
        "composition"
    ],

    astronomy: [
        "astronomy",
        "space",
        "stars",
        "star",
        "planet",
        "planets",
        "galaxy",
        "galaxies",
        "universe",
        "cosmos",
        "cosmic",
        "nasa",
        "telescope",
        "astrophysics",
        "moon",
        "mars",
        "rocket",
        "rockets"
    ],

    film: [
        "film",
        "films",
        "movie",
        "movies",
        "cinema",
        "cinematic",
        "acting",
        "actor",
        "actress",
        "direction",
        "director",
        "screenplay",
        "script",
        "screenwriting",
        "short film",
        "video",
        "videography",
        "editing",
        "production"
    ],

    literature: [
        "literature",
        "literary",
        "writing",
        "writer",
        "writers",
        "poetry",
        "poem",
        "poems",
        "story",
        "stories",
        "novel",
        "novels",
        "reading",
        "books",
        "book",
        "debate",
        "public speaking",
        "speaking",
        "content writing"
    ],

    culture: [
        "culture",
        "cultural",
        "tradition",
        "traditions",
        "dance",
        "dancing",
        "festival",
        "festivals",
        "heritage",
        "folk",
        "community",
        "celebration",
        "celebrations",
        "indian culture",
        "performance",
        "performing"
    ],

    fitness: [
        "fitness",
        "gym",
        "exercise",
        "workout",
        "workouts",
        "sports",
        "sport",
        "running",
        "run",
        "football",
        "cricket",
        "basketball",
        "badminton",
        "yoga",
        "health",
        "training",
        "athletics",
        "athletic",
        "physical",
        "strength"
    ],

    cooking: [
        "cook",
        "cooking",
        "food",
        "foods",
        "chef",
        "baking",
        "bake",
        "recipe",
        "recipes",
        "kitchen",
        "cuisine",
        "culinary",
        "dessert",
        "desserts",
        "cake",
        "cakes",
        "bread",
        "restaurant"
    ],

    gardening: [
        "garden",
        "gardening",
        "plants",
        "plant",
        "flowers",
        "flower",
        "nature",
        "green",
        "environment",
        "environmental",
        "trees",
        "tree",
        "farming",
        "soil",
        "sustainability",
        "sustainable",
        "outdoors"
    ],

    travel: [
        "travel",
        "travelling",
        "traveling",
        "trip",
        "trips",
        "tour",
        "tourism",
        "explore",
        "exploring",
        "places",
        "adventure",
        "adventures",
        "culture",
        "new places"
    ],

    volunteering: [
        "volunteer",
        "volunteering",
        "social work",
        "community service",
        "helping",
        "help",
        "service",
        "ngo",
        "community",
        "social impact"
    ],

    entrepreneurship: [
        "business",
        "entrepreneur",
        "entrepreneurship",
        "startup",
        "startups",
        "marketing",
        "finance",
        "management",
        "innovation",
        "product",
        "products",
        "leadership"
    ]
};


// ============================================================
// STOP WORDS
// ============================================================

const STOP_WORDS = new Set([
    "the",
    "and",
    "or",
    "but",
    "with",
    "for",
    "from",
    "that",
    "this",
    "have",
    "has",
    "had",
    "about",
    "into",
    "also",
    "very",
    "really",
    "just",
    "like",
    "love",
    "enjoy",
    "want",
    "would",
    "could",
    "should",
    "can",
    "my",
    "me",
    "i",
    "im",
    "i'm",
    "is",
    "am",
    "are",
    "to",
    "of",
    "in",
    "on",
    "at",
    "it",
    "as",
    "be",
    "a",
    "an",
    "new",
    "more",
    "some",
    "any",
    "their",
    "they",
    "we",
    "our",
    "you",
    "your"
]);


// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalizeText(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/c\+\+/g, "cpp")
        .replace(/c#/g, "csharp")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


function tokenize(text) {
    return normalizeText(text)
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}


// ============================================================
// DETECT SEMANTIC GROUPS
// ============================================================

function detectSemanticGroups(text) {

    const normalized = normalizeText(text);

    const detected = [];

    for (const [group, words] of Object.entries(SEMANTIC_GROUPS)) {

        let found = false;

        for (const keyword of words) {

            const normalizedKeyword = normalizeText(keyword);

            if (
                normalized === normalizedKeyword ||
                normalized.includes(` ${normalizedKeyword} `) ||
                normalized.startsWith(`${normalizedKeyword} `) ||
                normalized.endsWith(` ${normalizedKeyword}`) ||
                normalized.includes(normalizedKeyword)
            ) {
                found = true;
                break;
            }
        }

        if (found) {
            detected.push(group);
        }
    }

    return detected;
}


// ============================================================
// EXTRACT ALL SEARCHABLE CLUB TEXT
// ============================================================

function getClubSearchText(club) {

    const values = [];

    Object.entries(club || {}).forEach(([key, value]) => {

        if (key === "id") return;

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            values.push(String(value));
        }

        if (Array.isArray(value)) {
            value.forEach(item => {
                if (
                    typeof item === "string" ||
                    typeof item === "number"
                ) {
                    values.push(String(item));
                }
            });
        }
    });

    return values.join(" ");
}


// ============================================================
// FIND SEMANTIC CLUB CATEGORIES
// ============================================================

function getClubGroups(club) {

    const text = getClubSearchText(club);

    return detectSemanticGroups(text);
}


// ============================================================
// GOAL COMPATIBILITY
// ============================================================

function calculateGoalScore(clubText, goals) {

    if (!goals || goals.length === 0) {
        return 50;
    }

    const text = normalizeText(clubText);

    let matched = 0;

    goals.forEach(goal => {

        const goalKeywords = {

            skills: [
                "skill",
                "learning",
                "learn",
                "workshop",
                "training",
                "practice",
                "development"
            ],

            people: [
                "community",
                "social",
                "friends",
                "people",
                "team",
                "group",
                "collaboration",
                "collaborate"
            ],

            portfolio: [
                "portfolio",
                "project",
                "projects",
                "creative",
                "design",
                "production",
                "website",
                "photography",
                "film",
                "coding"
            ],

            events: [
                "event",
                "events",
                "festival",
                "workshop",
                "competition",
                "activities",
                "activity"
            ],

            break: [
                "fun",
                "creative",
                "relax",
                "recreation",
                "hobby",
                "music",
                "art",
                "games",
                "fitness"
            ],

            hobbies: [
                "hobby",
                "hobbies",
                "interest",
                "creative",
                "activity",
                "activities",
                "passion"
            ]
        };

        const keywords = goalKeywords[goal] || [];

        if (keywords.some(keyword => text.includes(keyword))) {
            matched++;
        }
    });

    return Math.round((matched / goals.length) * 100);
}


// ============================================================
// PERSONALITY COMPATIBILITY
// ============================================================

function calculatePersonalityScore(clubText, aboutYou) {

    if (!aboutYou) {
        return 50;
    }

    const text = normalizeText(clubText);

    const mappings = {

        new: [
            "beginner",
            "learn",
            "explore",
            "workshop",
            "activities",
            "community",
            "introduction"
        ],

        friends: [
            "community",
            "social",
            "group",
            "team",
            "friends",
            "collaboration",
            "collaborative",
            "people"
        ],

        learning: [
            "learn",
            "learning",
            "skill",
            "skills",
            "workshop",
            "training",
            "practice",
            "development"
        ],

        passions: [
            "advanced",
            "creative",
            "passion",
            "projects",
            "practice",
            "competition",
            "production",
            "performance"
        ]
    };

    const keywords = mappings[aboutYou] || [];

    if (keywords.length === 0) {
        return 50;
    }

    const matches = keywords.filter(keyword =>
        text.includes(keyword)
    ).length;

    return Math.min(
        100,
        Math.round((matches / Math.min(keywords.length, 5)) * 100)
    );
}


// ============================================================
// TIME COMPATIBILITY
// ============================================================

function calculateTimeScore(clubText, time) {

    if (!time) {
        return 50;
    }

    const text = normalizeText(clubText);

    if (time === "few") {

        const flexibleWords = [
            "occasional",
            "weekly",
            "workshop",
            "events",
            "activities",
            "sessions",
            "casual"
        ];

        const heavyWords = [
            "daily",
            "intensive",
            "training",
            "regular",
            "commitment",
            "competition"
        ];

        const flexible = flexibleWords.filter(word =>
            text.includes(word)
        ).length;

        const heavy = heavyWords.filter(word =>
            text.includes(word)
        ).length;

        return Math.max(
            20,
            Math.min(100, 65 + flexible * 8 - heavy * 8)
        );
    }


    if (time === "occasional") {

        const flexibleWords = [
            "occasional",
            "events",
            "activities",
            "workshop",
            "sessions",
            "casual",
            "community"
        ];

        const matches = flexibleWords.filter(word =>
            text.includes(word)
        ).length;

        return Math.min(100, 60 + matches * 8);
    }


    if (time === "active") {

        const activeWords = [
            "regular",
            "weekly",
            "training",
            "competition",
            "projects",
            "practice",
            "production",
            "team",
            "events"
        ];

        const matches = activeWords.filter(word =>
            text.includes(word)
        ).length;

        return Math.min(100, 60 + matches * 6);
    }

    return 50;
}


// ============================================================
// SOCIAL COMPATIBILITY
// ============================================================

function calculateSocialScore(clubText, social) {

    if (!social) {
        return 50;
    }

    const text = normalizeText(clubText);

    const mappings = {

        alone: [
            "independent",
            "individual",
            "creative",
            "writing",
            "photography",
            "art",
            "coding",
            "research",
            "practice"
        ],

        small: [
            "small",
            "team",
            "collaboration",
            "collaborative",
            "project",
            "group",
            "workshop"
        ],

        large: [
            "community",
            "events",
            "festival",
            "performance",
            "social",
            "group",
            "people",
            "activities",
            "celebration"
        ]
    };

    const keywords = mappings[social] || [];

    const matches = keywords.filter(keyword =>
        text.includes(keyword)
    ).length;

    if (matches === 0) {
        return 50;
    }

    return Math.min(
        100,
        55 + matches * 7
    );
}


// ============================================================
// DIRECT TEXT MATCH
// ============================================================

function calculateKeywordScore(userText, clubText) {

    const userTokens = new Set(tokenize(userText));
    const clubTokens = new Set(tokenize(clubText));

    if (userTokens.size === 0 || clubTokens.size === 0) {
        return 0;
    }

    let exactMatches = 0;

    userTokens.forEach(token => {
        if (clubTokens.has(token)) {
            exactMatches++;
        }
    });

    const exactScore =
        (exactMatches / Math.min(userTokens.size, 12)) * 100;

    return Math.min(100, Math.round(exactScore));
}


// ============================================================
// SEMANTIC GROUP MATCH
// ============================================================

function calculateSemanticScore(userText, club) {

    const userGroups = detectSemanticGroups(userText);
    const clubGroups = getClubGroups(club);

    if (
        userGroups.length === 0 ||
        clubGroups.length === 0
    ) {
        return 0;
    }

    const matches = userGroups.filter(group =>
        clubGroups.includes(group)
    );

    if (matches.length === 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (matches.length /
                Math.max(userGroups.length, 1)) * 100
        )
    );
}


// ============================================================
// EVENT RELEVANCE
// ============================================================

function calculateEventScore(club) {

    const eventText = normalizeText(club.event || "");

    if (!eventText) {
        return 40;
    }

    if (
        eventText.includes("stay tuned") ||
        eventText.includes("upcoming activities")
    ) {
        return 40;
    }

    return 75;
}


// ============================================================
// FINAL DETERMINISTIC SCORE
// ============================================================
// IMPORTANT:
// The AI DOES NOT decide the displayed percentage.
// JavaScript calculates it.
// ============================================================

function calculateBaseScore(
    club,
    userText,
    aboutYou,
    time,
    social,
    goals
) {

    const clubText = getClubSearchText(club);

    const keywordScore =
        calculateKeywordScore(userText, clubText);

    const semanticScore =
        calculateSemanticScore(userText, club);

    const personalityScore =
        calculatePersonalityScore(clubText, aboutYou);

    const timeScore =
        calculateTimeScore(clubText, time);

    const socialScore =
        calculateSocialScore(clubText, social);

    const goalScore =
        calculateGoalScore(clubText, goals);

    const eventScore =
        calculateEventScore(club);


    // Main interest gets the highest weight.
    const weightedScore =
        keywordScore * 0.25 +
        semanticScore * 0.35 +
        goalScore * 0.15 +
        personalityScore * 0.10 +
        timeScore * 0.05 +
        socialScore * 0.05 +
        eventScore * 0.05;


    return {
        score: Math.round(
            Math.max(0, Math.min(100, weightedScore))
        ),

        keywordScore,
        semanticScore,
        goalScore,
        personalityScore,
        timeScore,
        socialScore,
        eventScore,

        userGroups: detectSemanticGroups(userText),
        clubGroups: getClubGroups(club)
    };
}


// ============================================================
// LOAD FIREBASE DATA
// ============================================================

async function loadData() {

    try {

        const [
            clubsSnapshot,
            eventsSnapshot
        ] = await Promise.all([

            getDocs(
                collection(db, "clubs")
            ),

            getDocs(
                collection(db, "events")
            )
        ]);


        const clubsData = [];

        clubsSnapshot.forEach(doc => {

            clubsData.push({
                id: doc.id,
                ...doc.data()
            });

        });


        const eventsData = [];

        eventsSnapshot.forEach(doc => {

            eventsData.push({
                id: doc.id,
                ...doc.data()
            });

        });


        clubs = clubsData.map(club => {

            const clubName =
                club.name ||
                club.title ||
                "Unnamed Club";


            const clubDesc =
                club.description ||
                club.desc ||
                "";


            const clubEvents =
                eventsData.filter(event =>

                    event.clubName === clubName ||
                    event.clubId === club.id
                );


            const upcomingEvent =
                clubEvents.find(
                    event =>
                        String(event.status || "")
                            .toLowerCase() === "upcoming"
                );


            const displayEvent =
                upcomingEvent

                    ? `${upcomingEvent.eventName || "Upcoming Activity"} (${upcomingEvent.date || "Date TBA"})`

                    : (
                        clubEvents.length > 0

                            ? (
                                clubEvents[0].eventName ||
                                "Stay tuned for upcoming activities!"
                            )

                            : "Stay tuned for upcoming activities!"
                    );


            return {

                ...club,

                id: club.id,

                name: clubName,

                description: clubDesc,

                icon: club.icon || "🎯",

                event: displayEvent
            };

        });


        console.log(
            "Aatmoday AI: Firebase data loaded.",
            clubs
        );


    } catch (error) {

        console.error(
            "Aatmoday AI: Firebase loading error:",
            error
        );

        alert(
            "Unable to load club data. Please refresh the page and try again."
        );
    }
}


// ============================================================
// OPTION BUTTONS
// ============================================================

function selectOption(button, group) {

    const buttons =
        document.querySelectorAll(
            `[data-group="${group}"]`
        );


    buttons.forEach(btn => {

        btn.classList.remove("selected");

    });


    button.classList.add("selected");

    userSelections[group] =
        button.dataset.value;
}


// ============================================================
// GOAL BUTTONS
// ============================================================

function toggleGoal(button) {

    const goal =
        button.dataset.goal;


    if (
        button.classList.contains("selected")
    ) {

        button.classList.remove("selected");

        userSelections.goals =
            userSelections.goals.filter(
                item => item !== goal
            );

        return;
    }


    if (
        userSelections.goals.length >= 3
    ) {

        alert(
            "You can select up to 3 goals."
        );

        return;
    }


    button.classList.add("selected");

    userSelections.goals.push(goal);
}


// ============================================================
// GET USER PROFILE
// ============================================================

function getUserProfile() {

    const interestInput =
        document
            .getElementById("interestInput")
            .value
            .trim();


    const additional =
        document
            .getElementById("additionalInterests")
            .value
            .trim();


    const combinedInterest =
        `${interestInput} ${additional}`.trim();


    return {

        interestInput,

        additional,

        combinedInterest,

        aboutYou:
            userSelections.aboutYou,

        time:
            userSelections.time,

        social:
            userSelections.social,

        goals:
            [...userSelections.goals]
    };
}


// ============================================================
// VALIDATE INPUT
// ============================================================

function validateProfile(profile) {

    if (
        profile.interestInput.length < 10
    ) {

        alert(
            "Please describe your interests a bit more so our AI can find a great match."
        );

        return false;
    }


    if (!profile.aboutYou) {

        alert(
            "Please select how you would describe yourself."
        );

        return false;
    }


    if (!profile.time) {

        alert(
            "Please select how much time you can usually give."
        );

        return false;
    }


    if (!profile.social) {

        alert(
            "Please select how you prefer working on your interests."
        );

        return false;
    }


    return true;
}


// ============================================================
// CREATE CANDIDATES
// ============================================================
// First stage happens locally.
// This means irrelevant clubs are filtered before AI is called.
// ============================================================

function createCandidates(profile) {

    const scored = clubs.map(club => {

        const scoring =
            calculateBaseScore(
                club,
                profile.combinedInterest,
                profile.aboutYou,
                profile.time,
                profile.social,
                profile.goals
            );


        return {

            ...club,

            baseScore:
                scoring.score,

            scoring
        };

    });


    // Sort strongest matches first.
    scored.sort(
        (a, b) =>
            b.baseScore - a.baseScore
    );


    // Keep only meaningful candidates.
    const meaningful =
        scored.filter(club => {

            return (
                club.baseScore >= 25 ||
                club.scoring.semanticScore >= 20
            );

        });


    // If there are enough meaningful matches,
    // send only the top candidates to the AI.
    if (meaningful.length >= 3) {

        return meaningful.slice(0, 7);

    }


    // Otherwise use top available clubs
    // for partial/none handling.
    return scored.slice(0, 5);
}


// ============================================================
// AI REQUEST
// ============================================================

async function askAIForSemanticAnalysis(
    profile,
    candidates
) {

    const candidatePayload =
        candidates.map(club => ({

            id: club.id,

            name: club.name,

            description: club.description || "",

            icon: club.icon || "🎯",

            event: club.event || "",

            localScore: club.baseScore,

            detectedClubTopics:
                club.scoring.clubGroups

        }));


    const userProfile = {

        interest:
            profile.interestInput,

        additionalInterests:
            profile.additional,

        personality:
            profile.aboutYou,

        timeCommitment:
            profile.time,

        socialPreference:
            profile.social,

        goals:
            profile.goals
    };


    const systemPrompt = `
You are the semantic reasoning layer of the Aatmoday Hobby Matchmaker.

Your job is NOT to invent scores.

JavaScript has already calculated a preliminary localScore for each club.

You must:
1. Understand the user's natural-language interests.
2. Compare them carefully with the supplied clubs.
3. Identify which supplied clubs are genuinely relevant.
4. Return semanticScore from 0 to 100 for each supplied candidate.
5. Explain the connection using only information supported by the candidate data and user profile.
6. Create a highly personalized icebreaker.
7. Use the user's actual words where natural.
8. Never invent a club, event, activity, skill, or fact that is not supplied.
9. Do not modify club IDs.
10. Do not invent percentages for the final UI.
11. If the user says something specific such as photography, canvas, coding, websites, music, travel, etc., use that exact concept in the icebreaker when relevant.
12. A weak semantic match should receive a low semanticScore.
13. Do not force matches just to reach three clubs.

The frontend will combine your semanticScore with deterministic scoring.

Return ONLY the requested JSON structure.
`;


    const userPrompt = `
USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

CANDIDATE CLUBS:
${JSON.stringify(candidatePayload, null, 2)}

For every candidate, return:
- id
- semanticScore
- reason
- icebreaker

Also return:
- status
- global_note

Status rules:
- "success" = at least 3 genuinely relevant clubs
- "partial" = 1 or 2 relevant/adjacent clubs
- "none" = no genuinely relevant clubs

The reason should be one concise sentence.

The icebreaker should be a natural question a student could actually ask another student at the club.

Do not mention scoring mechanics in the reason.
`;


    const response =
        await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${GROQ_API_KEY}`
                },

                body: JSON.stringify({

                    model:
                        "openai/gpt-oss-20b",

                    reasoning_effort:
                        "medium",

                    messages: [

                        {
                            role: "system",
                            content:
                                systemPrompt
                        },

                        {
                            role: "user",
                            content:
                                userPrompt
                        }

                    ],

                    response_format: {

                        type: "json_schema",

                        json_schema: {

                            name:
                                "aatmoday_match_response",

                            strict: true,

                            schema: {

                                type: "object",

                                properties: {

                                    status: {

                                        type: "string",

                                        enum: [
                                            "success",
                                            "partial",
                                            "none"
                                        ]
                                    },

                                    global_note: {

                                        type: "string"
                                    },

                                    matches: {

                                        type: "array",

                                        items: {

                                            type: "object",

                                            properties: {

                                                id: {
                                                    type: "string"
                                                },

                                                semanticScore: {

                                                    type: "number"
                                                },

                                                reason: {

                                                    type: "string"
                                                },

                                                icebreaker: {

                                                    type: "string"
                                                }

                                            },

                                            required: [

                                                "id",

                                                "semanticScore",

                                                "reason",

                                                "icebreaker"

                                            ],

                                            additionalProperties:
                                                false
                                        }
                                    }

                                },

                                required: [

                                    "status",

                                    "global_note",

                                    "matches"

                                ],

                                additionalProperties:
                                    false
                            }
                        }
                    }
                })
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "Groq API error:",
            data
        );

        throw new Error(
            data?.error?.message ||
            "Groq API request failed."
        );
    }


    const content =
        data?.choices?.[0]?.message?.content;


    if (!content) {

        throw new Error(
            "The AI returned an empty response."
        );
    }


    return JSON.parse(content);
}


// ============================================================
// FINAL SCORE
// ============================================================
// AI semantic understanding is combined with local scoring.
// The AI cannot directly choose the displayed percentage.
// ============================================================

function calculateFinalScore(
    candidate,
    aiMatch
) {

    const localScore =
        candidate.baseScore;


    const semanticScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    aiMatch?.semanticScore || 0
                )
            )
        );


    // AI semantic understanding gets 40%.
    // Deterministic local matching gets 60%.
    const finalScore =
        localScore * 0.60 +
        semanticScore * 0.40;


    return Math.round(
        Math.max(
            0,
            Math.min(
                99,
                finalScore
            )
        )
    );
}


// ============================================================
// FALLBACK RESULT
// ============================================================
// If Groq is temporarily unavailable,
// the deterministic matcher still works.
// ============================================================

function createFallbackMatches(
    candidates,
    profile
) {

    return candidates
        .filter(
            club =>
                club.baseScore >= 30
        )
        .slice(0, 3)
        .map(club => {

            const groups =
                club.scoring.clubGroups;


            let reason =
                "This club connects with the interests and preferences you shared.";


            if (
                groups.length > 0 &&
                club.scoring.semanticScore >= 50
            ) {

                reason =
                    `Your interest in ${groups[0]} connects closely with what this club offers.`;
            }


            const firstGoal =
                profile.goals[0];


            if (
                firstGoal === "skills"
            ) {

                reason +=
                    " It also gives you a way to develop your skills.";
            }


            if (
                firstGoal === "people"
            ) {

                reason +=
                    " It can also give you opportunities to meet like-minded students.";
            }


            if (
                firstGoal === "portfolio"
            ) {

                reason +=
                    " It can also give you practical work to build experience around.";
            }


            const exactWords =
                profile.interestInput
                    .split(/\s+/)
                    .filter(word =>
                        word.length > 4
                    )
                    .slice(0, 2)
                    .join(" ");


            const icebreaker =
                exactWords

                    ? `You mentioned "${exactWords}" — how do students in this club usually explore that here?`

                    : `What is something interesting that students usually get to try in this club?`;


            return {

                ...club,

                score:
                    club.baseScore,

                reason,

                icebreaker
            };

        });
}


// ============================================================
// FIND MATCHES
// ============================================================

async function findMatches() {

    if (clubs.length === 0) {

        alert(
            "Data is still loading. Please try again in a moment."
        );

        return;
    }


    const profile =
        getUserProfile();


    if (
        !validateProfile(profile)
    ) {
        return;
    }


    const loading =
        document.getElementById(
            "loadingBox"
        );


    const resultsSection =
        document.getElementById(
            "resultsSection"
        );


    loading.style.display =
        "block";


    resultsSection.style.display =
        "none";


    try {

        // ----------------------------------------------------
        // STEP 1: LOCAL CANDIDATE GENERATION
        // ----------------------------------------------------

        const candidates =
            createCandidates(profile);


        console.log(
            "Aatmoday AI candidates:",
            candidates
        );


        // ----------------------------------------------------
        // STEP 2: AI SEMANTIC REASONING
        // ----------------------------------------------------

        let aiData;

        try {

            aiData =
                await askAIForSemanticAnalysis(
                    profile,
                    candidates
                );

        } catch (aiError) {

            console.error(
                "AI semantic layer failed:",
                aiError
            );


            // Graceful fallback.
            const fallbackMatches =
                createFallbackMatches(
                    candidates,
                    profile
                );


            displayResults(

                fallbackMatches.length >= 3
                    ? "success"
                    : (
                        fallbackMatches.length > 0
                            ? "partial"
                            : "none"
                    ),

                fallbackMatches.length === 0
                    ? "We could not find a strong match from the current club database."
                    : "We used your interests and preferences to find the closest available communities.",

                fallbackMatches

            );


            loading.style.display =
                "none";


            resultsSection.style.display =
                "block";


            resultsSection.scrollIntoView({
                behavior: "smooth"
            });


            return;
        }


        // ----------------------------------------------------
        // STEP 3: MERGE AI + DETERMINISTIC MATCHING
        // ----------------------------------------------------

        const aiMatches =
            Array.isArray(aiData?.matches)
                ? aiData.matches
                : [];


        const finalMatches =
            aiMatches
                .map(aiMatch => {

                    const candidate =
                        candidates.find(
                            club =>
                                String(club.id) ===
                                String(aiMatch.id)
                        );


                    if (!candidate) {
                        return null;
                    }


                    const semanticScore =
                        Number(
                            aiMatch.semanticScore
                        );


                    // Ignore extremely weak semantic matches.
                    if (
                        semanticScore < 25 &&
                        candidate.baseScore < 45
                    ) {

                        return null;
                    }


                    return {

                        ...candidate,

                        score:
                            calculateFinalScore(
                                candidate,
                                aiMatch
                            ),

                        reason:
                            aiMatch.reason ||
                            "This club connects with your interests and preferences.",

                        icebreaker:
                            aiMatch.icebreaker ||
                            `You mentioned "${profile.interestInput}" — how could you explore that through this club?`
                    };

                })
                .filter(
                    match =>
                        match !== null
                );


        // ----------------------------------------------------
        // STEP 4: SORT BY REAL FINAL SCORE
        // ----------------------------------------------------

        finalMatches.sort(
            (a, b) =>
                b.score - a.score
        );


        // ----------------------------------------------------
        // STEP 5: LIMIT RESULTS
        // ----------------------------------------------------

        let cleanedMatches =
            finalMatches.slice(0, 3);


        let finalStatus;


        if (
            cleanedMatches.length >= 3
        ) {

            finalStatus =
                "success";

        } else if (
            cleanedMatches.length > 0
        ) {

            finalStatus =
                "partial";

        } else {

            finalStatus =
                "none";
        }


        // ----------------------------------------------------
        // STEP 6: DISPLAY
        // ----------------------------------------------------

        displayResults(

            finalStatus,

            aiData?.global_note || "",

            cleanedMatches

        );


        loading.style.display =
            "none";


        resultsSection.style.display =
            "block";


        resultsSection.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Aatmoday AI Matchmaking Error:",
            error
        );


        loading.style.display =
            "none";


        alert(
            "Our AI is currently taking a break. Please try again in a moment."
        );
    }
}


// ============================================================
// ESCAPE HTML
// ============================================================
// Prevents user-entered text from being inserted as HTML.
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// DISPLAY RESULTS
// ============================================================
// IMPORTANT:
// Existing UI structure/classes are preserved.
// ============================================================

function displayResults(
    status,
    globalNote,
    matches
) {

    const container =
        document.getElementById(
            "resultsContainer"
        );


    const summary =
        document.getElementById(
            "resultsSummary"
        );


    container.innerHTML =
        "";


    // --------------------------------------------------------
    // NO MATCH
    // --------------------------------------------------------

    if (
        status === "none" ||
        matches.length === 0
    ) {

        summary.innerHTML =
            `<strong style="color: var(--brand-red);">No exact matches found.</strong>`;


        container.innerHTML = `

            <div
                style="
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                    grid-column: 1 / -1;
                "
            >

                <h3
                    style="
                        color: #991b1b;
                        margin-bottom: 10px;
                    "
                >
                    Exploring New Horizons
                </h3>

                <p
                    style="
                        color: #7f1d1d;
                        font-size: 15px;
                        line-height: 1.6;
                    "
                >
                    ${
                        escapeHTML(
                            globalNote ||
                            "We don't currently have a club that fits this specific interest."
                        )
                    }
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // PARTIAL
    // --------------------------------------------------------

    if (
        status === "partial"
    ) {

        summary.innerHTML =
            `<strong style="color: #d97706;">Alternative Recommendations:</strong> We found some adjacent communities that might interest you.`;


        const noteBox =
            document.createElement(
                "div"
            );


        noteBox.style =
            "background: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 12px; margin-bottom: 24px; grid-column: 1 / -1;";


        noteBox.innerHTML = `

            <div
                style="
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                "
            >

                <span
                    style="
                        font-size: 20px;
                    "
                >
                    💡
                </span>

                <p
                    style="
                        color: #92400e;
                        margin: 0;
                        font-size: 14.5px;
                        line-height: 1.5;
                    "
                >
                    ${
                        escapeHTML(
                            globalNote ||
                            "These are the closest available communities based on your interests."
                        )
                    }
                </p>

            </div>

        `;


        container.appendChild(
            noteBox
        );


    } else {

        summary.textContent =
            "Our AI analyzed your exact words to find your perfect communities.";

    }


    // --------------------------------------------------------
    // MATCH CARDS
    // --------------------------------------------------------

    matches.forEach(club => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "result-card";


        const clubURL =
            `club.html?id=${encodeURIComponent(club.id)}`;


        const safeName =
            escapeHTML(
                club.name
            );


        const safeReason =
            escapeHTML(
                club.reason
            );


        const safeIcebreaker =
            escapeHTML(
                club.icebreaker
            );


        const safeEvent =
            escapeHTML(
                club.event
            );


        card.innerHTML = `

            <div class="card-header">

                <div class="club-title">

                    <div class="club-icon">
                        ${club.icon || "🎯"}
                    </div>

                    <h3>
                        ${safeName}
                    </h3>

                </div>


                <div class="match-score">

                    ${club.score}%<br>

                    <small>
                        Match
                    </small>

                </div>

            </div>


            <div class="why-match">

                <h4>
                    Why we picked this for you
                </h4>

                <p>
                    ${safeReason}
                </p>

            </div>


            <div
                class="icebreaker-box"
                style="
                    background: rgba(217, 4, 41, 0.05);
                    border-left: 3px solid var(--brand-red);
                    padding: 12px 16px;
                    margin: 15px 0;
                    border-radius: 4px;
                "
            >

                <h4
                    style="
                        margin: 0 0 6px 0;
                        color: var(--brand-red);
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    "
                >
                    💬 Suggested Icebreaker
                </h4>

                <p
                    style="
                        margin: 0;
                        font-style: italic;
                        color: var(--text-dark);
                        font-size: 14px;
                    "
                >
                    "${safeIcebreaker}"
                </p>

            </div>


            <div class="related-event">

                <h4>
                    📅 Next Activity
                </h4>

                <p>
                    ${safeEvent}
                </p>

            </div>


            <a
                href="${clubURL}"
                class="learn-more"
            >
                Learn More
                <span>→</span>
            </a>

        `;


        container.appendChild(
            card
        );

    });
}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();


        // -----------------------------------------------
        // QUESTION OPTIONS
        // -----------------------------------------------

        document
            .querySelectorAll(
                ".option-grid .option"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const group =
                            button.getAttribute(
                                "data-group"
                            );


                        selectOption(
                            button,
                            group
                        );

                    }
                );

            });


        // -----------------------------------------------
        // GOALS
        // -----------------------------------------------

        document
            .querySelectorAll(
                ".goal-options .goal"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        toggleGoal(
                            button
                        );

                    }
                );

            });


        // -----------------------------------------------
        // MATCH BUTTON
        // -----------------------------------------------

        const matchBtn =
            document.querySelector(
                ".match-button"
            );


        if (matchBtn) {

            matchBtn.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    findMatches();

                }
            );

        }

    }
);
