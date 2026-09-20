const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));


// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Aatmoday AI backend is running."
    });
});


// ============================================================
// GROQ AI MATCHING ENDPOINT
// ============================================================

app.post("/api/match", async (req, res) => {

    try {

        const {
            userProfile,
            candidates
        } = req.body;


        if (!userProfile || !candidates) {

            return res.status(400).json({
                error: "Missing userProfile or candidates."
            });

        }


        if (!process.env.GROQ_API_KEY) {

            console.error(
                "GROQ_API_KEY is missing from .env"
            );

            return res.status(500).json({
                error: "AI server configuration is incomplete."
            });

        }


        // ----------------------------------------------------
        // SYSTEM PROMPT
        // ----------------------------------------------------

        const systemPrompt = `
You are the semantic reasoning layer of the Aatmoday Hobby Matchmaker.

Your job is NOT to invent final match percentages.

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
10. Do not invent the final percentage shown to the user.
11. If the user says something specific such as photography, canvas, coding, websites, music, travel, etc., use that exact concept in the icebreaker when relevant.
12. A weak semantic match should receive a low semanticScore.
13. Do not force matches just to reach three clubs.

The frontend will combine your semanticScore with deterministic scoring.

Return ONLY the requested JSON structure.
`;


        // ----------------------------------------------------
        // USER PROMPT
        // ----------------------------------------------------

        const userPrompt = `
USER PROFILE:

${JSON.stringify(
    userProfile,
    null,
    2
)}


CANDIDATE CLUBS:

${JSON.stringify(
    candidates,
    null,
    2
)}


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


        // ----------------------------------------------------
        // GROQ REQUEST
        // ----------------------------------------------------

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${process.env.GROQ_API_KEY}`
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

            return res.status(
                response.status
            ).json({

                error:
                    data?.error?.message ||
                    "Groq API request failed."

            });

        }


        const content =
            data?.choices?.[0]?.message?.content;


        if (!content) {

            return res.status(500).json({

                error:
                    "The AI returned an empty response."

            });

        }


        let parsedResponse;


        try {

            parsedResponse =
                JSON.parse(content);

        } catch (parseError) {

            console.error(
                "AI JSON parsing error:",
                parseError
            );

            return res.status(500).json({

                error:
                    "The AI returned invalid JSON."

            });

        }


        return res.json(
            parsedResponse
        );


    } catch (error) {

        console.error(
            "Backend AI error:",
            error
        );


        return res.status(500).json({

            error:
                "AI service temporarily unavailable."

        });

    }

});


// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Aatmoday AI backend running at http://localhost:${PORT}`
        );

    }
);