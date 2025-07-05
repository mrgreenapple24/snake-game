// === Snake Game Logic ===

// Get DOM elements
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverMessage = document.getElementById("gameOver");

// Grid setup
const gridSize = 20; // Each tile is 20x20 pixels
const tileCount = canvas.width / gridSize; // 400 / 20 = 20 tiles

// Game state variables
let snake, dx, dy, food, score, gameInterval, gameRunning;

// reset game state
function initGame() {
  snake = [{ x: 10, y: 10 }]; // Snake starts in the middle
  dx = 0; // No initial direction
  dy = 0;
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  score = 0;
  gameRunning = true;
  gameOverMessage.style.display = "none"; // Hide Game Over message
  updateScore();

  // Draw background
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawRect(food.x, food.y, "red");

  // Draw snake
  snake.forEach((segment, index) =>
    drawRect(segment.x, segment.y, index === 0 ? "lime" : "green")
  );
}

// update the score
function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`;
}

// draws a tile with given color
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
}

// Main game loop
function drawGame() {
  if (!gameRunning) return;

  // Don't start the game until a direction is pressed
  if (dx === 0 && dy === 0) return;

  // Compute new head position
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Collision checks
  const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(gameInterval); // Stop game loop
    gameRunning = false;
    gameOverMessage.style.display = "block"; // Show Game Over message
    return;
  }

  // Move the snake
  snake.unshift(head); // Add new head

  // Check for food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop(); // Remove tail if no food eaten
  }

  // Draw background
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawRect(food.x, food.y, "red");

  // Draw snake
  snake.forEach((segment, index) =>
    drawRect(segment.x, segment.y, index === 0 ? "lime" : "green")
  );
}

// Handle arrow key direction input
function changeDirection(e) {
  if (!gameRunning) return;

  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
}


// Start game (only if not running)
function startGame() {
  if (gameRunning) return;
  initGame();
  gameInterval = setInterval(drawGame, 100); // Run game loop
}

// Restart game from scratch
function restartGame() {
  clearInterval(gameInterval);
  initGame();
  gameInterval = setInterval(drawGame, 100);
}

// Listen for arrow keys to control snake
document.addEventListener("keydown", changeDirection);