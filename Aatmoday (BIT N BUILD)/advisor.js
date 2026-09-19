function showFollowUpQuestions() {
    const interest = document.getElementById("interest").value;
    const submitBtn = document.getElementById("submitBtn");
    
    // Hide all dynamic sections first
    const allSections = document.querySelectorAll('.dynamic-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });

    if (interest !== "") {
        const specificSection = document.getElementById(interest + "-section");
        if (specificSection) {
            specificSection.classList.add('active');
        }
        submitBtn.style.display = "block";
    } else {
        submitBtn.style.display = "none";
    }
    
    document.getElementById("resultBox").style.display = "none";
}

function processForm() {
    const userName = document.getElementById("userName").value;
    const interest = document.getElementById("interest").value;
    const resultBox = document.getElementById("resultBox");

    // Display loading state
    resultBox.className = "loading";
    resultBox.innerHTML = "⏳ Running complex matchmaking algorithm...";
    resultBox.style.display = "block";

    // Simulate backend processing delay
    setTimeout(() => {
        let recommendedClub = "";
        let customDescription = "";

        // --- TECH LOGIC ---
        if (interest === "tech") {
            const focus = document.getElementById("techFocus").value;
            const level = document.getElementById("techLevel").value;
            const style = document.getElementById("techStyle").value;
            const goal = document.getElementById("techGoal").value;

            if (focus === "software") recommendedClub = "App Developers Guild";
            else if (focus === "hardware") recommendedClub = "Campus Robotics Team";
            else recommendedClub = "Data Science & AI Society";

            customDescription = `Since you are at a <strong>${level}</strong> level, this club is perfect for you. They focus heavily on <strong>${focus}</strong> and will support your preference for <strong>${style}</strong> work. This is an excellent stepping stone for your ultimate goal of <strong>${goal === 'faang' ? 'working in Big Tech' : goal === 'startup' ? 'launching a startup' : 'doing academic research'}</strong>.`;
        } 
        
        // --- SPORTS LOGIC ---
        else if (interest === "sports") {
            const focus = document.getElementById("sportsFocus").value;
            const intensity = document.getElementById("sportsIntensity").value;
            const time = document.getElementById("sportsTime").value;
            const schedule = document.getElementById("sportsSchedule").value;

            if (focus === "team" && intensity === "hardcore") recommendedClub = "Varsity Athletics Program";
            else if (focus === "team") recommendedClub = "Intramural Sports League";
            else if (focus === "outdoor") recommendedClub = "Wilderness & Hiking Club";
            else recommendedClub = "Campus Barbell & Fitness";

            customDescription = `Based on your desire for a <strong>${intensity}</strong> environment, this is your best fit. They accommodate a <strong>${time}</strong> time commitment and frequently organize activities during the <strong>${schedule}</strong>, matching your schedule perfectly!`;
        } 
        
        // --- ARTS LOGIC ---
        else if (interest === "arts") {
            const focus = document.getElementById("artsFocus").value;
            const vibe = document.getElementById("artsVibe").value;
            const goal = document.getElementById("artsGoal").value;
            const collab = document.getElementById("artsCollab").value;

            if (focus === "performing") recommendedClub = "Campus Theatre Society";
            else if (focus === "visual") recommendedClub = "Fine Arts & Design Studio";
            else recommendedClub = "Audio & Music Production Club";

            customDescription = `Your <strong>${vibe}</strong> artistic style will be highly valued here. Whether you prefer working <strong>${collab === 'solo' ? 'alone' : 'in groups'}</strong>, this organization will help you achieve your goal of <strong>${goal === 'hobby' ? 'enjoying art stress-free' : 'building a professional presence'}</strong>.`;
        }
        
        // --- SOCIAL LOGIC ---
        else if (interest === "social") {
            const focus = document.getElementById("socialFocus").value;
            const role = document.getElementById("socialRole").value;
            const interact = document.getElementById("socialInteract").value;
            const time = document.getElementById("socialTime").value;

            if (focus === "environment") recommendedClub = "Green Earth Campus Initiative";
            else if (focus === "global") recommendedClub = "Amnesty International Campus Chapter";
            else recommendedClub = "Community Action Volunteers";

            customDescription = `Because you prefer to be <strong>${role === 'handsOn' ? 'hands-on' : 'managing logistics and campaigns'}</strong>, you will thrive here. They urgently need people to work with <strong>${interact === 'kids' ? 'children' : interact === 'peers' ? 'fellow students' : 'behind the scenes data'}</strong>, and they host most of their events during <strong>${time}</strong>!`;
        }
        
        // --- BUSINESS LOGIC ---
        else if (interest === "business") {
            const focus = document.getElementById("businessFocus").value;
            const risk = document.getElementById("businessRisk").value;
            const env = document.getElementById("businessEnv").value;
            const skill = document.getElementById("businessSkill").value;

            if (focus === "startup") recommendedClub = "Founders & Entrepreneurs Society";
            else if (focus === "finance") recommendedClub = "Wall Street Finance Club";
            else recommendedClub = "Marketing & Brand Strategy Group";

            customDescription = `Your superpower in <strong>${skill}</strong> makes you an ideal candidate. This club fosters a <strong>${env}</strong> environment and caters perfectly to your <strong>${risk} risk</strong> tolerance approach to business and strategy.`;
        }

        // Output the result
        resultBox.className = ""; 
        resultBox.innerHTML = `
            <h3>🎉 Perfect Match Found for ${userName}!</h3>
            <p><strong>Recommended Organization:</strong> ${recommendedClub}</p>
            <hr style="border: 0; border-top: 1px solid #fad4d9; margin: 15px 0;">
            <p>${customDescription}</p>
        `;

    }, 1500); // 1.5 second delay for dramatic effect!
}