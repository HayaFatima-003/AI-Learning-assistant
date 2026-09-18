let knowledgeBase = [];
let knowledgeLoaded = false;


// Load the learning material
fetch("data/knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledgeBase = data;
        knowledgeLoaded = true;

        console.log("Knowledge base loaded:", knowledgeBase.length, "entries");
    })
    .catch(error => {
        console.error("Could not load knowledge base:", error);
    });


// Words that don't help identify the topic
const stopWords = [
    "what", "why", "how", "when", "where",
    "is", "are", "the", "a", "an",
    "does", "do", "can", "could",
    "would", "should", "tell", "me",
    "about", "explain", "please",
    "and", "or", "to", "of", "in",
    "for", "on", "with", "from"
];


// Search the knowledge base
function searchKnowledge(question) {

    const words = question
        .toLowerCase()
        .replace(/[?.,!]/g, "")
        .split(/\s+/)
        .filter(word =>
            word.length > 2 &&
            !stopWords.includes(word)
        );

    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(item => {

        const topic = item.topic.toLowerCase();
        const chapter = item.chapter.toLowerCase();
        const content = item.content.toLowerCase();

        let score = 0;

        words.forEach(word => {

            // Strong match: topic
            if (topic.includes(word)) {
                score += 5;
            }

            // Medium match: chapter
            if (chapter.includes(word)) {
                score += 3;
            }

            // Normal match: content
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


// Ask the tutor
function askQuestion() {

    const questionInput = document.getElementById("question");
    const responseBox = document.getElementById("response");
    const answerBox = document.getElementById("answer");
    const sourceBox = document.getElementById("source");

    const question = questionInput.value.trim();


    // Empty question
    if (question === "") {
        alert("Please enter a question.");
        return;
    }


    // Knowledge base still loading
    if (!knowledgeLoaded) {

        answerBox.innerHTML =
            "⏳ Please wait a moment while the learning library loads.";

        sourceBox.innerHTML =
            "📖 Source: Loading...";

        responseBox.style.display = "block";

        return;
    }


    const result = searchKnowledge(question);


    if (result) {

        answerBox.innerHTML = result.content;

        sourceBox.innerHTML =
            "📖 Source: " +
            result.chapter +
            " → " +
            result.topic;

    } else {

        answerBox.innerHTML =
            "I couldn't find relevant information in the current learning library.";

        sourceBox.innerHTML =
            "📖 Source: No relevant material found.";

    }


    responseBox.style.display = "block";
}
