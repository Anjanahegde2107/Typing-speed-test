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

startButton.addEventListener('click', startTest);
stopButton.addEventListener('click', stopTest);
inputElement.addEventListener('input', checkInput);

function startTest() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    sentenceElement.textContent = sentences[randomIndex];
    inputElement.value = '';
    inputElement.disabled = false;
    inputElement.focus();
    time = 0;
    isTesting = true;
    timeElement.textContent = time;
    speedElement.textContent = 0;
    stopButton.disabled = false;

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
}

function checkInput() {
    if (!isTesting) return;

    const typedText = inputElement.value;
    const originalText = sentenceElement.textContent;

    const wpm = Math.round((typedText.split(' ').length / time) * 60);
    speedElement.textContent = wpm;

    if (typedText === originalText) {
        clearInterval(timer);
        isTesting = false;
        stopButton.disabled = true;
    }
}
