let quizSet = [];
let current = 0;
let correctAnswers = [];
let numberOfQuestions = 10;
let legislators;
let zip;
let state;

const container = document.getElementById("quiz-container");
const homeContainer = document.getElementById("home-container");
const summaryContainer = document.getElementById("summary");
const zipInput = document.getElementById("zip");
const stateInput = document.getElementById("state");

async function showHome() {
	container.style.display = "none";
	homeContainer.style.display = "block";
	summaryContainer.style.display = "none";

	zipInput.value = zip || "";
	stateInput.value = state || "AL";
}

function startQuiz(questionsSelected) {
	if (!legislators) {
		alert("Please find your legislators first.");
		return;
	}
	updateQuestions();
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
        <button class="btn btn-primary" onclick="showAnswer()">Show Answer</button>
        <div id="answer" class="answer"></div>
        <div class="bottom-buttons"><button class="btn btn-primary" onclick="nextQuestion()">Next</button> <label><input type="checkbox" class="form-check-input" id="gotItRight"> I got it right</label></div>
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

function updateQuestions() {
	questions.map((q) => {
		q.answer = q.answer.replace(/<representative>/g, legislators.representatives.map(rep => `${rep.name} (${rep.party})`).join('\n'));
		q.answer = q.answer.replace(/<senators>/g, legislators.senators.map(sen => `${sen.name} (${sen.party})`).join('\n'));
		q.answer = q.answer.replace(/<governor>/g, legislators.governor.name);
		q.answer = q.answer.replace(/<capital>/g, legislators.governor.capital);
	});
}

async function findLegislators() {
	zip = zipInput.value;
	state = stateInput.value;
	const legislatorsContainer = document.getElementById("legislators");
	legislatorsContainer.innerHTML = "";
	if (zip && state) {
		try {
			legislators = await findRep(zip, state);

			if (!legislators) {
				legislatorsContainer.innerHTML("No legislators found for the state and zip code.");
				return;
			}

			updateQuestions();

			legislatorsContainer.innerHTML = `
			<ul>
			<li><strong>Governor</strong>: ${legislators.governor.name}</li>
			<li><strong>State Capital</strong>: ${legislators.governor.capital}</li>
			<li><strong>Representative</strong>: ${legislators.representatives.map(rep => `${rep.name} (${rep.party})`).join(', ')}</li>
			<li><strong>Senators</strong>: ${legislators.senators.map(sen => `${sen.name} (${sen.party})`).join(', ')}</li>
			</ul>
		`;
		} catch (error) {
			legislatorsContainer.innerHTML = "<strong>Error</strong>: No legislators found for the state and zip code.";
		}
	}
}

showHome();