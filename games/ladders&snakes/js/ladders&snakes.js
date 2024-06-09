const gameData = {
    boardSize: 0,
    snakesAndLaddersCount: 0,
    snakeAndLadderSize: 0,
    currentPlayer: 0,
    playerPositions: [],
    players: [],
    snakes: {},
    ladders: {}
};
let isGameOver = false;

function getRandomPosition(max) { return Math.floor(Math.random() * max) + 1; }
function updateBoardSize() { gameData.boardSize = parseInt(document.getElementById('boardSize').value); }
function updateSnakesAndLadders() { gameData.snakesAndLaddersCount = parseInt(document.getElementById('snakeAndLadderCount').value); }
function updateSnakeAndLadderSize() { gameData.snakeAndLadderSize = parseInt(document.getElementById('snakeAndLadderSize').value); }
function submitPlayerNames() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    for (let i = 0; i < playerCount; i++) {
        const name = prompt(`הזן את שם השחקן מספר ${i + 1}:`);
        gameData.players.push(name);
    } initializeGame();
}

function generateRandomPositions(count) {
    const positions = new Set();
    while (positions.size < count) {
        const position = getRandomPosition(gameData.boardSize);
        positions.add(position);
    } return Array.from(positions);
}
function resetGame() { players.forEach(player => { player.position = 0; }); placePlayers(); }
function startGame() {
    if (gameData.boardSize === 0 || gameData.snakesAndLaddersCount === 0 || gameData.players.length === 0) {
        displayErrorMessage('אנא הזן את כל הפרטים'); return;
    }

    gameData.playerPositions = new Array(gameData.players.length).fill(0);
    gameData.snakes = {};
    gameData.ladders = {};
    const snakePositions = generateRandomPositions(gameData.snakesAndLaddersCount);
    const ladderPositions = generateRandomPositions(gameData.snakesAndLaddersCount);

    snakePositions.forEach(pos => {
        let endPos;
        do { endPos = pos - getRandomPosition(gameData.boardSize / 2); }
        while (endPos < 1); gameData.snakes[pos] = endPos;
    });

    ladderPositions.forEach(pos => {
        let endPos;
        do { endPos = pos + getRandomPosition(gameData.boardSize / 2); }
        while (endPos > gameData.boardSize); gameData.ladders[pos] = endPos;
    });

    document.getElementById('gameBoard').style.display = 'grid';
    drawBoard()
}

function initializeGame() {
    const board = document.getElementById('gameBoard');
    board.style.gridTemplateColumns = `repeat(${Math.sqrt(gameData.boardSize)}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${Math.sqrt(gameData.boardSize)}, 1fr)`;

    board.innerHTML = '';

    for (let i = 1; i <= gameData.boardSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        if (gameData.snakes[i]) {
            const snake = document.createElement('div');
            snake.className = 'snake';
            snake.style.height = `${gameData.snakeAndLadderSize}px`;
            cell.appendChild(snake);
        }
        if (gameData.ladders[i]) {
            const ladder = document.createElement('div');
            ladder.className = 'ladder';
            ladder.style.height = `${gameData.snakeAndLadderSize}px`;
            cell.appendChild(ladder);
        }
        gameData.players.forEach((player, index) => {
            if (gameData.playerPositions[index] === i) {
                const playerElem = document.createElement('div');
                playerElem.className = 'player';
                if (index === gameData.currentPlayer) {
                    playerElem.classList.add('special-player');
                }
                cell.appendChild(playerElem);
            }
        });
        board.appendChild(cell);
    }
}
const horizontalPosition = '50%';
const verticalPosition = '50%';
function drawBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    for (let i = 1; i <= gameData.boardSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = i;
        if (gameData.snakes[i]) {
            const snake = document.createElement('div');
            snake.className = 'snake';
            snake.style.position = 'absolute';
            snake.style.transform = 'translate(-50%, -50%)rotate(-45deg)';
            snake.style.left = horizontalPosition;
            snake.style.top = verticalPosition;
            snake.style.height = `${gameData.snakeAndLadderSize}px`;
            cell.appendChild(snake);
        }
        if (gameData.ladders[i]) {
            const ladder = document.createElement('div');
            ladder.className = 'ladder';
            ladder.style.position = 'absolute';
            ladder.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
            ladder.style.left = horizontalPosition;
            ladder.style.top = verticalPosition;
            ladder.style.height = `${gameData.snakeAndLadderSize}px`;
            ladder.innerHTML = `
                      <div class="steps">
                        <div class="step"></div>
                        <div class="step"></div>
                        <div class="step"></div>
                        <div class="step"></div>
                    </div>`;
            cell.appendChild(ladder);
        }
        gameData.players.forEach((player, index) => {
            if (gameData.playerPositions[index] === i) {
                const playerElem = document.createElement('div');
                playerElem.className = 'player';
                playerElem.setAttribute('data-index', gameData.playerPositions[index] + 1);

                if (index === gameData.currentPlayer) {
                    playerElem.classList.add('special-player');
                }
                cell.appendChild(playerElem);
            }
        });
        board.appendChild(cell);
    }
}

function startRolling() {
    if (isGameOver) return;

    const rollImages = [
        "imgLasssers&snake/diceNumber1.png",
        "imgLasssers&snake/diceNumber2.png",
        "imgLasssers&snake/diceNumber3.png",
        "imgLasssers&snake/diceNumber4.png",
        "imgLasssers&snake/diceNumber5.png",
        "imgLasssers&snake/diceNumber6.png"
    ];

    const diceImg = document.getElementById('diceImg');
    const rollSound = document.getElementById('rollSound');

    const roll = Math.floor(Math.random() * 6) + 1;
    rollSound.play();
    const timer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * rollImages.length);
        diceImg.src = rollImages[randomIndex];
    }, 300);

    setTimeout(() => {
        clearInterval(timer);
        diceImg.src = rollImages[roll - 1];
        displayErrorMessage(`${gameData.players[gameData.currentPlayer]} גלגל/ה ${roll}`);
        movePlayer(roll);
    }, 1000 * 3);
    diceImg.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
    ], {
        duration: 1000,
        iterations: 1
    });
}

function movePlayer(roll) {

    const newPos = gameData.playerPositions[gameData.currentPlayer] + roll;
    if (newPos <= gameData.boardSize) {
        gameData.playerPositions[gameData.currentPlayer] = newPos;

        if (gameData.snakes[newPos]) {
            displayErrorMessage(`הופה! ${gameData.players[gameData.currentPlayer]} ננשך/ה על ידי נחש ונפל/ה אחורה!`);
            gameData.playerPositions[gameData.currentPlayer] = gameData.snakes[newPos];
        } else if (gameData.ladders[newPos]) {
            displayErrorMessage(`מזל טוב! ${gameData.players[gameData.currentPlayer]} טיפס/ה בסולם!`);
            gameData.playerPositions[gameData.currentPlayer] = gameData.ladders[newPos];
        }
    } else {
        displayErrorMessage(`לא ניתן להתקדם! ${gameData.players[gameData.currentPlayer]} נשאר/ה באותו מקום!`);
    }
    drawBoard();
    gameData.currentPlayer = (gameData.currentPlayer + 1) % gameData.players.length;
    if (gameData.playerPositions.includes(gameData.boardSize)) {
        isGameOver = true;
        gameover();
        return;
    }
}

function moveSnakesAndLaddersRandom() {
    gameData.snakes = {};
    gameData.ladders = {};
    let endPos;
    let maxAttempts = 100;
    let attempts = 0;
    const snakePositions = generateRandomPositions(gameData.snakesAndLaddersCount);
    const ladderPositions = generateRandomPositions(gameData.snakesAndLaddersCount);

    snakePositions.forEach(pos => {
        do { endPos = pos - getRandomPosition(gameData.boardSize / 2); attempts++; }
        while (endPos < 1 && attempts < maxAttempts);
        if (attempts >= maxAttempts) { endPos = 1; }
        gameData.snakes[pos] = endPos;
    });

    ladderPositions.forEach(pos => {
        do { endPos = pos + getRandomPosition(gameData.boardSize / 2); attempts++; }
        while (endPos > gameData.boardSize && attempts < maxAttempts);
        if (attempts >= maxAttempts) { endPos = gameData.boardSize; }
        gameData.ladders[pos] = endPos;
    }); drawBoard();
}
function displayErrorMessage(mission) {
    let positionMessage = "";
    let errorMessageElement = document.querySelector(".mission");
    if (errorMessageElement) {
        errorMessageElement.textContent = `${mission} ${positionMessage}`;
        errorMessageElement.style.display = "block";
        setTimeout(() => { errorMessageElement.style.display = "none"; }, 1000 * 5);
    } else {
        console.error("Error: .mission element not found.");
    }
}


function gameover() {
    const winnerIndex = gameData.playerPositions.findIndex(position => position === gameData.boardSize);
    if (winnerIndex !== -1) { // בדיקה אם יש מנצח
        const winner = gameData.players[winnerIndex];
        alert(`סיימתם את המשחק! תודה על השתתפותכם, המנצח הוא: ${winner}`);
    }
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameData.boardSize = 0;
    gameData.snakesAndLaddersCount = 0;
    gameData.snakeAndLadderSize = 0;
    gameData.currentPlayer = 0;
    gameData.playerPositions = [];
    gameData.players = [];
    gameData.snakes = {};
    gameData.ladders = {};
    document.getElementById('gameBoard').style.display = 'none';
}
function movePlayerAnimated() {
    const currentPlayer = document.querySelector('.player.special-player');
    if (!currentPlayer) return;

    const targetCell = document.querySelector(`.cell:nth-child(${gameData.playerPositions[gameData.currentPlayer]})`);
    const playerSize = currentPlayer.offsetWidth;
    const targetPos = targetCell.getBoundingClientRect();

    currentPlayer.animate([
        { transform: `translate(0, 0)` },
        { transform: `translate(${targetPos.left - playerSize / 2}px, ${targetPos.top - playerSize / 2}px)` }
    ], {
        duration: 1000,
        easing: 'ease-in-out'
    });
}
function createPlayerElement(playerIndex) {
    const playerElement = document.createElement('div');
    playerElement.className = 'player';
    playerElement.style.backgroundColor = ['red', 'blue', 'green', 'yellow'][playerIndex % 4];
    return playerElement;
}