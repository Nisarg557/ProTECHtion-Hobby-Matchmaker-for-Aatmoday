/* =====================================================
   AATMODAY INTEREST CONCEPTS
===================================================== */

const interestConcepts = {

    photography: {
        label: "Photography",
        aliases: [
            "photo",
            "photos",
            "photograph",
            "photographs",
            "photography",
            "camera",
            "cameras",
            "photographer",
            "photographers",
            "dslr"
        ]
    },

    creativity: {
        label: "Creativity",
        aliases: [
            "creative",
            "creativity",
            "creative work",
            "creative content",
            "artistic",
            "art",
            "arts"
        ]
    },

    visualStorytelling: {
        label: "Visual Storytelling",
        aliases: [
            "visual storytelling",
            "visual story",
            "visual content"
        ]
    },

    video: {
        label: "Video & Content",
        aliases: [
            "video",
            "videos",
            "videography",
            "editing",
            "video editing",
            "content creation",
            "content"
        ]
    },

    coding: {
        label: "Coding & Programming",
        aliases: [
            "code",
            "coding",
            "programming",
            "programmer",
            "developer",
            "development",
            "software",
            "software development",
            "web development",
            "app development"
        ]
    },

    technology: {
        label: "Technology",
        aliases: [
            "technology",
            "tech",
            "computer",
            "computers",
            "digital"
        ]
    },

    robotics: {
        label: "Robotics",
        aliases: [
            "robot",
            "robots",
            "robotics",
            "arduino",
            "electronics",
            "hardware"
        ]
    },

    artificialIntelligence: {
        label: "Artificial Intelligence",
        aliases: [
            "ai",
            "artificial intelligence",
            "machine learning",
            "ml",
            "deep learning"
        ]
    },

    reading: {
        label: "Reading",
        aliases: [
            "read",
            "reading",
            "book",
            "books",
            "novel",
            "novels"
        ]
    },

    writing: {
        label: "Writing",
        aliases: [
            "write",
            "writing",
            "writer",
            "writers",
            "story",
            "stories",
            "creative writing"
        ]
    },

    poetry: {
        label: "Poetry",
        aliases: [
            "poetry",
            "poem",
            "poems"
        ]
    },

    literature: {
        label: "Literature",
        aliases: [
            "literature",
            "literary",
            "literary work"
        ]
    },

    debate: {
        label: "Debate & Discussion",
        aliases: [
            "debate",
            "debating",
            "discussion",
            "discussions",
            "public speaking",
            "speaking"
        ]
    },

    fitness: {
        label: "Fitness",
        aliases: [
            "fitness",
            "fit",
            "exercise",
            "workout",
            "workouts",
            "training",
            "physical fitness"
        ]
    },

    sports: {
        label: "Sports",
        aliases: [
            "sport",
            "sports",
            "athletics",
            "athletic",
            "running",
            "run",
            "football",
            "cricket",
            "basketball",
            "badminton"
        ]
    },

    yoga: {
        label: "Yoga & Wellness",
        aliases: [
            "yoga",
            "meditation",
            "wellness",
            "mindfulness"
        ]
    },

    cooking: {
        label: "Cooking",
        aliases: [
            "cook",
            "cooking",
            "food",
            "foods",
            "recipe",
            "recipes",
            "kitchen",
            "culinary",
            "chef"
        ]
    },

    baking: {
        label: "Baking",
        aliases: [
            "baking",
            "bake",
            "cakes",
            "cake",
            "pastry",
            "desserts"
        ]
    },

    gardening: {
        label: "Gardening",
        aliases: [
            "garden",
            "gardening",
            "gardener",
            "plant",
            "plants",
            "planting"
        ]
    },

    nature: {
        label: "Nature",
        aliases: [
            "nature",
            "natural",
            "outdoor",
            "outdoors",
            "environment",
            "environmental",
            "green"
        ]
    },

    sustainability: {
        label: "Sustainability",
        aliases: [
            "sustainability",
            "sustainable",
            "eco friendly",
            "eco-friendly",
            "recycling",
            "conservation"
        ]
    },

    culture: {
        label: "Culture",
        aliases: [
            "culture",
            "cultural",
            "tradition",
            "traditional",
            "festival",
            "festivals"
        ]
    },

    music: {
        label: "Music",
        aliases: [
            "music",
            "musical",
            "singing",
            "song",
            "songs",
            "instrument",
            "instruments",
            "guitar",
            "piano"
        ]
    },

    dance: {
        label: "Dance",
        aliases: [
            "dance",
            "dancing",
            "choreography"
        ]
    },

    performance: {
        label: "Performance",
        aliases: [
            "performance",
            "performing",
            "acting",
            "theatre",
            "theater",
            "stage"
        ]
    }

};


/* =====================================================
   AATMODAY CLUBS
===================================================== */

const clubs = [

    {
        id: "photography",

        name: "Photography Club",

        icon: "📷",

        concepts: [
            "photography",
            "creativity",
            "visualStorytelling",
            "video"
        ],

        event: "Photography Workshop",

        description:
            "Capture moments, tell stories and explore the world through your lens. A strong fit for students interested in photography and creative visual work."
    },


    {
        id: "cultural",

        name: "Cultural Club",

        icon: "🎭",

        concepts: [
            "culture",
            "creativity",
            "music",
            "dance",
            "performance"
        ],

        event: "Deekshotsava 2023",

        description:
            "Explore cultural activities, performances, music, dance and celebrations while connecting with other students."
    },


    {
        id: "literary",

        name: "Literary Club",

        icon: "📚",

        concepts: [
            "reading",
            "writing",
            "poetry",
            "literature",
            "debate"
        ],

        event: "Akalpit — The Literary Fest",

        description:
            "A space for students interested in reading, writing, poetry, storytelling, literature and discussions."
    },


    {
        id: "fitness",

        name: "Fitness Club",

        icon: "💪",

        concepts: [
            "fitness",
            "sports",
            "yoga"
        ],

        event: "Yoga Activity",

        description:
            "A good fit for students interested in fitness, physical activities, sports, yoga and staying active."
    },


    {
        id: "cooking",

        name: "Cooking Club",

        icon: "👨‍🍳",

        concepts: [
            "cooking",
            "baking"
        ],

        event: "Flameless Cooking Competition",

        description:
            "Explore cooking, recipes, food and culinary creativity while participating in hands-on activities."
    },


    {
        id: "gardening",

        name: "Gardening Club",

        icon: "🌱",

        concepts: [
            "gardening",
            "nature",
            "sustainability"
        ],

        event: "Re-Planting Activity",

        description:
            "A good fit for students interested in plants, gardening, nature, environmental activities and sustainability."
    },


    {
        id: "coding",

        name: "Coding & Robotics",

        icon: "🤖",

        concepts: [
            "coding",
            "technology",
            "robotics",
            "artificialIntelligence"
        ],

        event: "Cloud Computing For Beginners Talk",

        description:
            "A strong fit for students interested in coding, technology, robotics, artificial intelligence and technical projects."
    }

];


/* =====================================================
   USER SELECTIONS
===================================================== */

let userSelections = {

    aboutYou: null,

    time: null,

    social: null,

    goals: []

};


/* =====================================================
   SELECT OPTION
===================================================== */

function selectOption(button, group) {

    const buttons =
        document.querySelectorAll(
            `[data-group="${group}"]`
        );

    buttons.forEach(
        btn =>
            btn.classList.remove("selected")
    );

    button.classList.add("selected");

    userSelections[group] =
        button.dataset.value;
}


/* =====================================================
   SELECT GOALS
===================================================== */

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


/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


/* =====================================================
   CHECK TERM
===================================================== */

function containsTerm(text, term) {

    const escaped =
        term.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

    const regex =
        new RegExp(
            `(^|\\s)${escaped}(?=\\s|$)`,
            "i"
        );

    return regex.test(text);
}


/* =====================================================
   DETECT INTEREST CONCEPTS
===================================================== */

function detectConcepts(text) {

    const normalized =
        normalizeText(text);

    const detected = [];

    Object.entries(
        interestConcepts
    ).forEach(
        ([conceptId, concept]) => {

            const matched =
                concept.aliases.some(
                    alias =>
                        containsTerm(
                            normalized,
                            normalizeText(alias)
                        )
                );

            if (matched) {

                detected.push(
                    conceptId
                );

            }

        }
    );

    return detected;
}


/* =====================================================
   FIND MATCHES
===================================================== */

function findMatches() {

    const interestInput =
        document
            .getElementById(
                "interestInput"
            )
            .value
            .trim();

    const additional =
        document
            .getElementById(
                "additionalInterests"
            )
            .value
            .trim();


    /* VALIDATION */

    if (
        interestInput.length < 10
    ) {

        alert(
            "Please tell us a little more about your interests."
        );

        return;
    }


    if (
        !userSelections.aboutYou
    ) {

        alert(
            "Please select which option best describes you."
        );

        return;
    }


    if (
        !userSelections.time
    ) {

        alert(
            "Please select how much time you can usually give."
        );

        return;
    }


    if (
        !userSelections.social
    ) {

        alert(
            "Please select how you prefer working on your interests."
        );

        return;
    }


    const fullText =
        `${interestInput} ${additional}`;


    const detectedConcepts =
        detectConcepts(fullText);


    const loading =
        document.getElementById(
            "loadingBox"
        );

    loading.style.display =
        "block";


    setTimeout(
        () => {

            const results =
                clubs.map(
                    club =>
                        scoreClub(
                            club,
                            detectedConcepts
                        )
                );


            results.sort(
                (a, b) =>
                    b.score - a.score
            );


            const topMatches =
                results.slice(0, 3);


            displayInterestProfile(
                detectedConcepts
            );


            displayResults(
                topMatches
            );


            loading.style.display =
                "none";


            const resultsSection =
                document.getElementById(
                    "resultsSection"
                );


            resultsSection.style.display =
                "block";


            resultsSection.scrollIntoView({
                behavior: "smooth"
            });

        },

        900
    );

}


/* =====================================================
   SCORE CLUB
===================================================== */

function scoreClub(
    club,
    detectedConcepts
) {

    let score = 0;

    const matchedConcepts = [];


    club.concepts.forEach(
        conceptId => {

            if (
                detectedConcepts.includes(
                    conceptId
                )
            ) {

                score += 10;

                matchedConcepts.push(
                    conceptId
                );

            }

        }
    );


    /* SOCIAL */

    if (
        userSelections.social === "small"
    ) {

        score += 2;

    }


    if (
        userSelections.social === "large"
    ) {

        score += 3;

    }


    /* GOALS */

    userSelections.goals.forEach(
        goal => {

            if (
                goal === "skills"
            ) {

                score += 2;

            }

            if (
                goal === "people"
            ) {

                score += 2;

            }

            if (
                goal === "events"
            ) {

                score += 2;

            }

            if (
                goal === "hobbies"
            ) {

                score += 2;

            }

            if (
                goal === "portfolio"
            ) {

                if (
                    club.id === "coding" ||
                    club.id === "photography" ||
                    club.id === "literary"
                ) {

                    score += 3;

                }

            }

        }
    );


    /* TIME */

    if (
        userSelections.time === "active"
    ) {

        score += 2;

    }


    return {

        ...club,

        score,

        matchedConcepts

    };

}


/* =====================================================
   DISPLAY INTEREST PROFILE
===================================================== */

function displayInterestProfile(
    conceptIds
) {

    const container =
        document.getElementById(
            "interestProfile"
        );


    const labels =
        conceptIds.map(
            id =>
                interestConcepts[id].label
        );


    if (
        labels.length === 0
    ) {

        container.innerHTML = `

            <h3>
                🧠 What we understood from you
            </h3>

            <p
                style="
                    color:#667085;
                    font-size:12px;
                "
            >
                We couldn't identify specific hobby keywords,
                so your preferences will be used to explore
                suitable communities.
            </p>

        `;

        return;
    }


    container.innerHTML = `

        <h3>
            🧠 What we understood from you
        </h3>

        <div class="interest-tags">

            ${labels
                .map(
                    label => `

                        <span class="interest-tag">
                            ${label}
                        </span>

                    `
                )
                .join("")}

        </div>

    `;
}


/* =====================================================
   DISPLAY RESULTS
===================================================== */

function displayResults(matches) {

    const container =
        document.getElementById(
            "resultsContainer"
        );

    container.innerHTML = "";


    document
        .getElementById(
            "resultsSummary"
        )
        .textContent =
        "These recommendations are based on your interests, preferences and goals.";


    const highestScore =
        Math.max(
            ...matches.map(
                club => club.score
            )
        );


    matches.forEach(
        club => {

            let percentage;


            if (
                highestScore <= 0
            ) {

                percentage = 55;

            } else {

                percentage =
                    Math.round(
                        60 +
                        (
                            club.score /
                            highestScore
                        ) * 35
                    );

            }


            percentage =
                Math.min(
                    95,
                    Math.max(
                        55,
                        percentage
                    )
                );


            const matchedLabels =
                club.matchedConcepts
                    .map(
                        conceptId =>
                            interestConcepts[
                                conceptId
                            ].label
                    )
                    .slice(0, 3);


            const tagsHTML =
                matchedLabels.length

                    ?

                    matchedLabels
                        .map(
                            label => `

                                <span
                                    class="matched-interest"
                                >
                                    ${label}
                                </span>

                            `
                        )
                        .join("")

                    :

                    `

                        <span
                            class="matched-interest"
                        >
                            Preference Match
                        </span>

                    `;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-card";


            /*
             * IMPORTANT:
             *
             * The club-specific URL is created here.
             *
             * Example:
             *
             * Photography Club
             * -> club.html?id=photography
             *
             * Coding & Robotics
             * -> club.html?id=coding
             */

            const clubURL =
                `club.html?id=${encodeURIComponent(
                    club.id
                )}`;


            card.innerHTML = `

                <div class="card-header">

                    <div class="club-title">

                        <div class="club-icon">
                            ${club.icon}
                        </div>

                        <h3>
                            ${club.name}
                        </h3>

                    </div>


                    <div class="match-score">

                        ${percentage}%

                        <br>

                        <small>
                            Match
                        </small>

                    </div>

                </div>


                <div class="matched-interests">

                    ${tagsHTML}

                </div>


                <div class="why-match">

                    <h4>
                        About this match
                    </h4>

                    <p>
                        ${club.description}
                    </p>

                </div>


                <div class="related-event">

                    <h4>
                        📅 Related Aatmoday Activity
                    </h4>

                    <p>
                        ${club.event}
                    </p>

                </div>


                <a
                    href="${clubURL}"
                    class="learn-more"
                >

                    Learn More

                    <span>
                        →
                    </span>

                </a>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Aatmoday Matchmaker loaded."
        );

    }
);
