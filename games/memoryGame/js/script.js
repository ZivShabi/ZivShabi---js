const flex = document.querySelector(".containerMemoryGame");
let card1 = null;
let count = 0;
let attempts = 0;
let sec = 0;
let min = 0;
let interval;
let lockBoard = false;

const images = [
    "img/crowd.png",
    "img/dinosaur.png",
    "img/dog.png",
    "img/ship.png",
    "img/sky.png",
    "img/stadium.png",
    "img/stars.png",
    "img/wallClock.png",
    "img/family.png",
    "img/lake.png",
    "img/moon.png",
    "img/music.png",
    "img/piano.png",
    "img/sun.png",
    "img/iceCream.png",
];
const shuffleBtn = document.getElementById('shuffleBtn');
const startBtn = document.getElementById('startBtn');
const input = document.getElementById('input');
shuffleBtn.addEventListener('click', shuffleCards);
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        resetGame();
    } else if (event.key === "N") {
        // Start a new game
        startGame();
    } else if (event.key === "P") {
        toggleTimer();
    }
});

function resetGame() {
    flex.style.display = 'none';
    flex.innerHTML = '';
    clearInterval(interval);
    card1 = null;
    count = 0;
    attempts = 0;
    sec = 0;
    min = 0;
    lockBoard = false;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
    document.getElementById('timer').textContent = `Timer: ${min}:00`;
}

function toggleTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    } else {
        interval = setInterval(timer, 1000);
    }
}

function flip(event) {
    if (lockBoard) return;
    const card = event.currentTarget;
    if (card.classList.contains('flip') || count === parseInt(input.value)) return;
    if (card === card1 || card.classList.contains('flip')) return;
    card.classList.toggle('flip');
    if (card1 == null) {
        card1 = card;
    } else {
        lockBoard = true;
        attempts++;
        document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
        if (card1.dataset.id === card.dataset.id) {
            setTimeout(() => {
                card.classList.add('fade-out');
                card1.classList.add('fade-out');
                setTimeout(() => {
                    card.remove();
                    card1.remove();
                    card1 = null;
                    count++;
                    lockBoard = false;
                    if (count === parseInt(input.value)) {
                        clearInterval(interval);
                        alert(`מזל טוב! ניצחתם ב-${min} דקות ו-${sec < 10 ? '0' + sec : sec} שניות עם ${attempts} ניסיונות`);
                        updateHighScores(min, sec);
                    }
                }, 1000);
            }, 500);
        } else {
            setTimeout(() => {
                if (card1 && card) {
                    card.classList.remove('flip');
                    card1.classList.remove('flip');
                    card1 = null;
                }
                lockBoard = false;
            }, 1000);
        }
    }
}

function createCard(imageSrc) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = imageSrc;

    const back = document.createElement("img");
    back.classList.add("back");
    back.src = imageSrc;
    back.alt = "back";

    const front = document.createElement("img");
    front.classList.add("front");
    front.src = "img/cardSculpyue.png";
    front.alt = "front";

    card.appendChild(back);
    card.appendChild(front);
    card.addEventListener('click', flip);
    return card;
}

function startGame() {
    flex.style.display = 'flex';
    flex.innerHTML = '';
    clearInterval(interval);
    card1 = null;
    count = 0;
    attempts = 0;
    sec = 0;
    min = 0;
    lockBoard = false;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
    const numPairs = parseInt(input.value);
    if (isNaN(numPairs) || numPairs < 1 || numPairs > 15) {
        alert('נא להזין מספר זוגות תקין בין 1 ל-15.');
        return;
    }
    const selectedImages = images.slice(0, numPairs);
    const shuffledImages = shuffle([...selectedImages, ...selectedImages]);
    shuffledImages.forEach(imageSrc => {
        const card = createCard(imageSrc);
        flex.appendChild(card);
    });
    shuffleBtn.style.display = 'block';
    interval = setInterval(timer, 1000);
}

function timer() {
    const p = document.getElementById('timer');
    p.textContent = `Timer: ${min}:${sec < 10 ? '0' + sec : sec}`;
    sec++;
    if (sec === 60) {
        min++;
        sec = 0;
    }
}

function shuffleCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
    const shuffledImages = shuffle(cards.map(card => card.dataset.id));
    flex.innerHTML = '';
    shuffledImages.forEach(imageSrc => {
        const card = createCard(imageSrc);
        flex.appendChild(card);
    });
    resetStatistics();
}

function resetStatistics() {
    attempts = 0;
    sec = 0;
    min = 0;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
    document.getElementById('timer').textContent = `Timer: ${min}:00`;
}

function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function updateHighScores(min, sec) {
    const highScores = document.getElementById('highScores');
    const currentScore = `${min}:${sec < 10 ? '0' + sec : sec}`;
    const prevHighScore = localStorage.getItem('highScore');
    if (!prevHighScore || currentScore < prevHighScore) {
        localStorage.setItem('highScore', currentScore);
        highScores.textContent = `High Scores: ${currentScore}`;
    } else {
        highScores.textContent = `High Scores: ${prevHighScore}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const highScore = localStorage.getItem('highScore');
    if (highScore) {
        document.getElementById('highScores').textContent = `High Scores: ${highScore}`;
    }
});