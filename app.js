let quizSet = [];
let current = 0;
let correctAnswers = [];
let numberOfQuestions = 10;

const container = document.getElementById("quiz-container");
const homeContainer = document.getElementById("home-container");
const summaryContainer = document.getElementById("summary");

async function showHome() {
	container.style.display = "none";
	homeContainer.style.display = "block";
	summaryContainer.style.display = "none";
}

function startQuiz(questionsSelected) {
	numberOfQuestions = questionsSelected;
	homeContainer.style.display = "none";
	container.style.display = "block";
	quizSet = questions.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);
	current = 0;
	correctAnswers = [];
	summaryContainer.style.display = "none";
	showQuestion();
}

function showQuestion() {
	container.innerHTML = "";

	if (current >= quizSet.length) {
		showSummary();
		return;
	}

	const q = quizSet[current];

	// Add bullet points to the answer
	const answerLines = q.answer.split('\n');
	const ul = document.createElement('ul');
	answerLines.forEach(line => {
		const li = document.createElement('li');
		li.textContent = line.trim();
		ul.appendChild(li);
	});

	// Create the question card
	const card = document.createElement("div");
	card.innerHTML = `
        <div class="question"><strong>Question ${current + 1} of ${numberOfQuestions}:</strong>
					<p>${q.question}</p>
				</div>
        <button onclick="showAnswer()">Show Answer</button>
        <div id="answer" class="answer"></div>
        <div class="bottom-buttons"><button onclick="nextQuestion()">Next</button> <label><input type="checkbox" id="gotItRight"> I got it right</label></div>
      `;
	container.appendChild(card);
	document.getElementById('answer').appendChild(ul);
}

function showAnswer() {
	document.getElementById("answer").style.display = "block";
}

function nextQuestion() {
	const gotIt = document.getElementById("gotItRight").checked;
	correctAnswers.push(gotIt);
	current++;
	showQuestion();
}

function showSummary() {
	container.innerHTML = "";
	container.style.display = "none";
	const correct = correctAnswers.filter((ans) => ans).length;
	const wrong = correctAnswers.length - correct;

	document.getElementById("results").innerHTML = `
        You answered <span class="correct">${correct} correct</span> and 
        <span class="wrong">${wrong} wrong</span> out of ${correctAnswers.length} questions.
      `;
	summaryContainer.style.display = "block";
}

showHome();