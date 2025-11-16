const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let seconds = 0;
let minutes = 0;

document.getElementById("highScore").innerText = highScore;

// KEYBOARD CONTROL
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// MOBILE TOUCH CONTROL
document.querySelector(".up").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
document.querySelector(".down").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
document.querySelector(".left").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
document.querySelector(".right").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

// FOOD SPAWN
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// DRAW GRID
function drawGrid() {
  for (let x = 0; x < canvas.width; x += box) {
    for (let y = 0; y < canvas.height; y += box) {
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x, y, box, box);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // SNAKE
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(snake[i].x, snake[i].y, box - 1, box - 1);
  }

  // FOOD
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box - 1, box - 1);

  // MOVE
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // EAT FOOD
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // GAME OVER
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    clearInterval(timer);
    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }
    alert("Game Over! Reload to play again.");
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// TIMER
function updateTimer() {
  seconds++;
  if (seconds === 60) {
    minutes++;
    seconds = 0;
  }
  document.getElementById("timer").innerText =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

let game = setInterval(draw, 120);
let timer = setInterval(updateTimer, 1000);
