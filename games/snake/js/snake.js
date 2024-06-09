const board = document.querySelector("#board");
const width = window.screen.width < 640 ? 20 : 40; // הרוחב בהתאם לרוחב המסך
const height = 40;
const snake = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
const divs = [];
let currentDirection = "right"; // הגדרת הכיוון ההתחלתי
let direction = 'left';
let touchStartX;
let touchStartY;
let isGameOver = false;
let interval;
let random;
let score = 0;

function createBoard() {
    board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    for (let i = 0; i < width * height; i++) {
        const div = document.createElement("div");
        board.appendChild(div); divs.push(div);
    } changeDirection(); setApple();
}

function move(dir) {
    if (isGameOver) { return; }
    let head = snake[0];
    if (dir === 'up') {
        if (direction === 'down') { return; }
        head -= width;
        if (head < 0) { gameOver(); return; }
    } else if (dir === 'down') {
        if (direction === 'up') { return; }
        head += width;
        if (head >= width * height) { gameOver(); return; }
    } else if (dir === 'left') {
        if (direction === 'right') { return; }
        head++;
        if (head % width === 0) { gameOver(); return; }
    } else if (dir === 'right') {
        if (direction === 'left') { return; }
        if (head % width === 0) { gameOver(); return; }
        head--;
    }
    if (snake.includes(head)) { gameOver(); return; }
    direction = dir; snake.unshift(head);
    if (head === random) {
        score++;
        document.querySelector("#score span").innerText = score;
        sound("./Pebble.ogg"); setApple();
    } else { snake.pop(); }
    changeDirection(); autoMove();
}

window.addEventListener("keydown", function (ev) {
    ev.preventDefault();
    touchStartX = null;
    touchStartY = null;
    switch (ev.key) {
        case "ArrowUp": move(changeDirection("up")); break;
        case "ArrowRight": move(changeDirection("right")); break;
        case "ArrowDown": move(changeDirection("down")); break;
        case "ArrowLeft": move(changeDirection("left")); break;
        case "Escape": clearInterval(interval); break;
    }
});

function autoMove() {
    clearInterval(interval);
    const speed = 300 - score;
    interval = setInterval(() => move(direction), speed > 50 ? speed : 50);
}
function gameOver() {
    isGameOver = true;
    clearInterval(interval);
    const divText = document.querySelector(".divText");
    if (divText) {
        divText.classList.add("glow");
        divText.innerText = " הא או פיספסתת ";
    }
    sound("./Country_Blues.ogg");
    document.querySelector("#newGame").style.display = "initial";
    setTimeout(() => alert("Game over"), 50);
}

function setApple() {
    do { random = Math.floor(Math.random() * width * height); }
    while (snake.includes(random));
    divs.forEach(d => d.classList.remove('apple'));
    divs[random].classList.add("apple");
}

function sound(fileName) { const audio = new Audio(`Pebble/${fileName}`); audio.play(); }

function newGame() {
    snake.splice(0, snake.length);
    snake.push(9, 8, 7, 6, 5, 4, 3, 2, 1, 0);
    isGameOver = false;
    score = 0;
    changeDirection();
    setApple();
    document.querySelector("#newGame").style.display = "none";
}

function changeDirection(dir) {
    divs.forEach(div => {
        div.classList.remove("snake", "head");
    });
    snake.forEach((x, i) => {
        divs[x].classList.add("snake");
        if (i === 0) { divs[x].classList.add("head"); }
    });

    for (let i = 0; i < snake.length; i++) {
        let div = divs[snake[i]];
        let nextDiv = divs[snake[i + 1]];
        if (!nextDiv) {
            break; // יציאה מהלולאה אם nextDiv הוא null
        }
        div.style.borderTopRightRadius = nextDiv.style.borderTopRightRadius;
        div.style.borderBottomRightRadius = nextDiv.style.borderBottomRightRadius;
        div.style.borderBottomLeftRadius = nextDiv.style.borderBottomLeftRadius;
        div.style.borderTopLeftRadius = nextDiv.style.borderTopLeftRadius;
    }

    let headDiv = divs[snake[0]];
    switch (dir) {
        case "up":
            headDiv.style.borderTopRightRadius = "0px";
            headDiv.style.borderBottomRightRadius = "0px";
            headDiv.style.borderBottomLeftRadius = "20px";
            headDiv.style.borderTopLeftRadius = "0px";
            break;
        case "right":
            headDiv.style.borderTopLeftRadius = "20px";
            headDiv.style.borderBottomLeftRadius = "0px";
            headDiv.style.borderBottomRightRadius = "0px";
            headDiv.style.borderTopRightRadius = "20px";
            break;
        case "down":
            headDiv.style.borderTopRightRadius = "20px";
            headDiv.style.borderBottomRightRadius = "0px";
            headDiv.style.borderBottomLeftRadius = "0px";
            headDiv.style.borderTopLeftRadius = "20px";
            break;
        case "left":
            headDiv.style.borderTopLeftRadius = "0px";
            headDiv.style.borderBottomLeftRadius = "0px";
            headDiv.style.borderBottomRightRadius = "20px";
            headDiv.style.borderTopRightRadius = "0px";
            break;
    }
    return dir;
}


const arrowButtons = document.querySelectorAll('.arrow-button');

arrowButtons.forEach(button => {
    button.addEventListener('click', () => {
        const dir = button.id;
        move(dir);
    });
});

const isMobile = window.matchMedia("(max-width: 640px)").matches;
if (isMobile) {
    window.addEventListener("touchstart", handleTouchStart, false);
    window.addEventListener("touchmove", handleTouchMove, false);
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // אם ההזזה בציר X גדולה מההזזה בציר Y
        if (dx > 0 && currentDirection !== 'left') {
            move(changeDirection('right'));
        } else if (dx < 0 && currentDirection !== 'right') {
            move(changeDirection('left'));
        }
    } else {
        // אם ההזזה בציר Y גדולה מההזזה בציר X
        if (dy > 0 && currentDirection !== 'up') {
            move(changeDirection('down'));
        } else if (dy < 0 && currentDirection !== 'down') {
            move(changeDirection('up'));
        }
    }

    // איפוס הערכים של נקודת ההתחלה
    touchStartX = null;
    touchStartY = null;
}