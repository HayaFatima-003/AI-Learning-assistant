let knowledgeBase = [];

// Load the learning material
fetch("data/knowledge.json")
    .then(response => response.json())
    .then(data => {
        knowledgeBase = data;
        console.log("Knowledge base loaded:", knowledgeBase.length, "entries");
    })
    .catch(error => {
        console.error("Could not load knowledge base:", error);
    });


// Search the knowledge base
function searchKnowledge(question) {

    const words = question
        .toLowerCase()
        .replace(/[?.,!]/g, "")
        .split(" ");

    let bestMatch = null;
    let highestScore = 0;

    knowledgeBase.forEach(item => {

        const searchableText = (
            item.topic + " " +
            item.chapter + " " +
            item.content
        ).toLowerCase();

        let score = 0;

        words.forEach(word => {

            if (word.length > 2 && searchableText.includes(word)) {
                score++;
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

    const question = questionInput.value.trim();

    const responseBox = document.getElementById("response");

    const answerBox = document.getElementById("answer");

    if (question === "") {
        alert("Please enter a question.");
        return;
    }

    const result = searchKnowledge(question);

    if (result) {

        answerBox.innerHTML = result.content;

        document.querySelector(".source").innerHTML =
            "📖 Source: " +
            result.chapter +
            " → " +
            result.topic;

    } else {

        answerBox.innerHTML =
            "I couldn't find relevant information in the current learning library.";

        document.querySelector(".source").innerHTML =
            "📖 Source: No relevant material found.";

    }

    responseBox.style.display = "block";
}


// Demo buttons
function showMessage(message) {

    alert(message);

}
