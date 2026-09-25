let knowledgeBase = [];
let knowledgeLoaded = false;


// ===============================
// LOAD KNOWLEDGE BASE
// ===============================

fetch("data/knowledge.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load knowledge base.");
        }

        return response.json();
    })
    .then(data => {

        knowledgeBase = data;
        knowledgeLoaded = true;

        console.log(
            "Knowledge base loaded:",
            knowledgeBase.length,
            "entries"
        );

    })
    .catch(error => {

        console.error(error);

        knowledgeLoaded = false;

    });


// ===============================
// STOP WORDS
// ===============================

const stopWords = [

    "what", "why", "how", "when", "where",
    "who", "which", "is", "are", "the",
    "a", "an", "does", "do", "did",
    "can", "could", "would", "should",
    "tell", "me", "about", "explain",
    "please", "and", "or", "to", "of",
    "in", "for", "on", "with", "from",
    "this", "that", "it", "be",
    "happen", "happens"
];


// ===============================
// NORMALIZE TEXT
// ===============================

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[?.,!;:()]/g, "")
        .split(/\s+/)
        .filter(word =>
            word.length > 2 &&
            !stopWords.includes(word)
        );

}


// ===============================
// SEARCH KNOWLEDGE BASE
// ===============================

function searchKnowledge(question) {

    const words = normalizeText(question);

    let bestMatch = null;
    let highestScore = 0;


    knowledgeBase.forEach(item => {

        const topic = item.topic.toLowerCase();
        const chapter = item.chapter.toLowerCase();
        const content = (
            item.explanation + " " +
            item.why + " " +
            item.practicalExample
        ).toLowerCase();


        let score = 0;


        words.forEach(word => {

            // Topic match = strongest
            if (topic.includes(word)) {
                score += 5;
            }


            // Chapter match
            if (chapter.includes(word)) {
                score += 3;
            }


            // Content match
            if (content.includes(word)) {
                score += 1;
            }

        });


        if (score > highestScore) {

            highestScore = score;
            bestMatch = item;

        }

    });


    return bestMatch;

}


// ===============================
// DISPLAY TUTOR RESPONSE
// ===============================

function displayTutorResponse(result) {

    const answerBox =
        document.getElementById("answer");

    const sourceBox =
        document.getElementById("source");


    answerBox.innerHTML = `

        <strong>💡 Explanation</strong>

        <p style="margin-top:8px;">
            ${result.explanation}
        </p>


        <br>


        <strong>🔍 Why does this happen?</strong>

        <p style="margin-top:8px;">
            ${result.why}
        </p>


        <br>


        <strong>🛢️ Practical Example</strong>

        <p style="margin-top:8px;">
            ${result.practicalExample}
        </p>


        <br>


        <strong>🧠 Key Takeaway</strong>

        <p style="margin-top:8px;">
            ${result.keyTakeaway}
        </p>

    `;


    sourceBox.innerHTML =
        "📖 Source: " +
        result.chapter +
        " → " +
        result.topic;

}


// ===============================
// ASK QUESTION
// ===============================

async function askQuestion() {

    const questionInput =
        document.getElementById("question");

    const responseBox =
        document.getElementById("response");

    const answerBox =
        document.getElementById("answer");

    const sourceBox =
        document.getElementById("source");


    const question =
        questionInput.value.trim();


    if (question === "") {

        alert("Please enter a question.");

        return;

    }


    // Show response box
    responseBox.style.display = "block";

    answerBox.innerHTML =
        "⏳ Asking the KHT AI Assistant...";

    sourceBox.innerHTML =
        "📖 Source: Searching knowledge base...";


    try {

        const response = await fetch(
            "https://ai-assistant-backend-vs18.onrender.com/ask?question=" +
            encodeURIComponent(question)
        );


        if (!response.ok) {

            throw new Error(
                "Backend request failed."
            );

        }


        const data =
            await response.json();


        // =========================
        // WORD RESPONSE
        // =========================

        if (data.source === "Word") {

            answerBox.innerHTML = `

                <strong>💡 ${data.section}</strong>

                <p style="margin-top:10px;">
                    ${data.content}
                </p>

            `;


            sourceBox.innerHTML =
                "📖 Source: KHT Knowledge Base → " +
                data.section;

        }


        // =========================
        // EXCEL RESPONSE
        // =========================

        else if (data.source === "Excel") {

            answerBox.innerHTML = `

                <strong>📊 Excel Data Found</strong>

                <p style="margin-top:10px;">
                    ${data.records_found} matching records found.
                </p>

            `;


            sourceBox.innerHTML =
                "📖 Source: KHT Sample Operational Data";

        }


        // =========================
        // NOTHING FOUND
        // =========================

        else {

            answerBox.innerHTML = `

                <strong>🤔 No relevant information found.</strong>

                <p style="margin-top:8px;">
                    Try asking a question related to
                    KHT operations, procedures, HSE,
                    permits, or operational data.
                </p>

            `;


            sourceBox.innerHTML =
                "📖 Source: No relevant material found.";

        }

    }


    catch (error) {

        console.error(error);


        answerBox.innerHTML = `

            <strong>⚠️ Backend connection error</strong>

            <p style="margin-top:8px;">
                The KHT AI Assistant could not connect
                to the backend.
            </p>

        `;


        sourceBox.innerHTML =
            "📖 Source: Backend unavailable.";

    }

}
