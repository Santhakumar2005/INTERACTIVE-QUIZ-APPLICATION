let questions=[];
let currentquestionIndex=0;
let score=0;
fetch('questions.json')
    .then(response=>response.json())
    .then(data=>{
        questions=data;
        totalQuestions=questions.length;
        InitializeQuestionTracker();
        loadNextQuestion();
        updateProgressBar();
    })
    .catch(error=>{
        console.error('Error loading the questions: ',error);
    })
//Start quiz
document.getElementById('start-screen').addEventListener('click',()=>{
document.getElementById('start-screen').classList.add('hidden');
document.getElementById('quiz-container').classList.remove('hidden');
document.getElementById('progress-bar').style.width = '0%';
startTimer();
});
let timerInterval;  // Variable to hold the timer interval
let elapsedSeconds = 0;  // Track total elapsed seconds

function startTimer() {
    elapsedSeconds = 0;  // Reset timer at the start of the quiz
    timerInterval = setInterval(() => {
        elapsedSeconds++;

        // Calculate hours, minutes, and seconds
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;

        // Update the timer display
        document.getElementById('timer').textContent = `${hours}Hours ${minutes}Minutes ${seconds}Seconds`;
    }, 1000);  // Update every second
}

function stopTimer() {
    clearInterval(timerInterval);  // Stop the timer
}

function InitializeQuestionTracker(){
    const tracker=document.getElementById('question-tracker');
    for(let i=0;i<totalQuestions;i++){
        const box=document.createElement("div");
        box.classList.add("question-box");
        box.textContent=i+1;
        tracker.appendChild(box);
    }
}
function updateProgressBar() {
    if(currentquestionIndex===0)return;
    const progress = ((currentquestionIndex + 1) / totalQuestions) * 100;
    const clampedProgress = Math.min(progress, 100);
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
}


function loadNextQuestion() {
    if (currentquestionIndex < questions.length) {
        const question = questions[currentquestionIndex];
        document.getElementById('question').textContent = question.question;
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = ''; // Clear previous options
        question.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.onclick = () => handleAnswer(option, question.correctAnswer);
            optionsContainer.appendChild(optionButton);
        });
        document.getElementById('feedback').textContent = ''; // Clear previous feedback
    } else {
        // End the quiz
        document.getElementById('question-container').innerHTML = `
            <h2>QUIZ FINISHED</h2>
            <p>YOUR FINAL SCORE IS: ${score} / ${questions.length}</p>`;
        document.getElementById('next-question').style.display = 'none'; // Hide "Next Question" button
        stopTimer();
    }
}

function handleAnswer(selectedoption,correctAnswer){
    const feedback=document.getElementById("feedback");
    const tracker=document.getElementById("question-tracker");
    const boxes=tracker.getElementsByClassName("question-box");
    if(selectedoption===correctAnswer){
        feedback.textContent='CORRECT!!!';
        feedback.style.color='green';
        boxes[currentquestionIndex].classList.add("correct");
        score++;
    }else{
        feedback.textContent='INCORRECT!!!';
        feedback.style.color='red';
        boxes[currentquestionIndex].classList.add("wrong");
    }
    document.getElementById('score-value').textContent=score;
    updateProgressBar();
    currentquestionIndex++;
    const optionsButtons=document.getElementById('options').children;
    for(let i=0;i<optionsButtons.length;i++){
        optionsButtons[i].disabled=true;
    }
}
document.getElementById('next-question').addEventListener('click',loadNextQuestion);
