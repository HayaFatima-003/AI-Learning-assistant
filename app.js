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

function askQuestion() {

    const questionInput =
        document.getElementById("question");

    const responseBox =
        document.getElementById("response");


    const question =
        questionInput.value.trim();


    if (question === "") {

        alert("Please enter a question.");

        return;

    }


    if (!knowledgeLoaded) {

        document.getElementById("answer").innerHTML =
            "⏳ The learning library is still loading. Please try again in a moment.";

        responseBox.style.display = "block";

        return;

    }


    const result =
        searchKnowledge(question);


    if (result) {

        displayTutorResponse(result);

    }

    else {

        document.getElementById("answer").innerHTML = `

            <strong>🤔 I couldn't find that concept.</strong>

            <p style="margin-top:8px;">
                Try asking about a concept available in the
                current learning library.
            </p>

        `;


        document.getElementById("source").innerHTML =
            "📖 Source: No relevant material found.";

    }


    responseBox.style.display = "block";

}
