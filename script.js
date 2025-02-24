const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "In the middle of difficulty lies opportunity."
];

let timer;
let time = 0;
let isTesting = false;

const sentenceElement = document.getElementById('sentence');
const inputElement = document.getElementById('input');
const timeElement = document.getElementById('time');
const speedElement = document.getElementById('speed');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const wordCountElement = document.getElementById('wordCount');
const accuracyElement = document.getElementById('accuracy');
const restartButton = document.getElementById('restart');
const customSentenceInput = document.getElementById('customSentence');
const historyList = document.getElementById('historyList');

const typingSound = new Audio('path/to/typing-sound.mp3');
const completionSound = new Audio('path/to/completion-sound.mp3');

startButton.addEventListener('click', startTest);
stopButton.addEventListener('click', stopTest);
inputElement.addEventListener('input', checkInput);
restartButton.addEventListener('click', () => {
    inputElement.value = '';
    startTest();
});

function startTest() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    const sentenceToUse = customSentenceInput.value.trim() || sentences[randomIndex];
    sentenceElement.textContent = sentenceToUse;
    inputElement.value = '';
    inputElement.disabled = false;
    inputElement.focus();
    time = 0;
    isTesting = true;
    timeElement.textContent = time;
    speedElement.textContent = 0;
    stopButton.disabled = false;
    wordCountElement.textContent = 0;
    accuracyElement.textContent = 100;
    restartButton.disabled = true;

    timer = setInterval(() => {
        time++;
        timeElement.textContent = time;
    }, 1000);
}

function stopTest() {
    clearInterval(timer);
    isTesting = false;
    stopButton.disabled = true;

    const typedText = inputElement.value;
    const wpm = Math.round((typedText.split(' ').length / time) * 60);
    speedElement.textContent = wpm;

    const correctChars = typedText.split('').filter((char, index) => char === sentenceElement.textContent[index]).length;
    const accuracy = Math.round((correctChars / sentenceElement.textContent.length) * 100);
    accuracyElement.textContent = accuracy;

    const historyItem = document.createElement('li');
    historyItem.textContent = `Speed: ${wpm} WPM, Accuracy: ${accuracy}%, Time: ${time} seconds`;
    historyList.appendChild(historyItem);

    completionSound.play();

    updateLeaderboard(wpm);
}

function checkInput() {
    if (!isTesting) return;

    typingSound.play();
    const typedText = inputElement.value;
    const originalText = sentenceElement.textContent;

    const wordsTyped = typedText.split(' ').filter(word => word).length;
    wordCountElement.textContent = wordsTyped;

    const correctChars = typedText.split('').filter((char, index) => char === originalText[index]).length;
    const accuracy = Math.round((correctChars / originalText.length) * 100);
    accuracyElement.textContent = accuracy;

    const wpm = Math.round((wordsTyped / time) * 60);
    speedElement.textContent = wpm;

    if (typedText === originalText) {
        clearInterval(timer);
        isTesting = false;
        stopButton.disabled = true;
        restartButton.disabled = false;
    }
}

function updateLeaderboard(wpm) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(wpm);
    leaderboard.sort((a, b) => b - a); // Sort in descending order
    leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score} WPM`;
        document.getElementById('leaderboardList').appendChild(li);
    });
}
