function initSnake() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Snake</h2>
        <div class="score-display">Счёт: <span id="snakeScore">0</span></div>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <div class="controls">
            <button onclick="resetSnake()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">Используйте стрелки для движения</p>
    `;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let direction = {x: 1, y: 0};
    let nextDirection = {x: 1, y: 0};
    let score = 0;
    let gameRunning = true;

    function drawGame() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4CAF50';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#FF5252';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function update() {
        direction = nextDirection;
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
            snake.some(s => s.x === head.x && s.y === head.y)) {
            gameRunning = false;
            alert('Конец игры! Счёт: ' + score);
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snakeScore').textContent = score;
            food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        } else {
            snake.pop();
        }

        drawGame();
        if (gameRunning) setTimeout(update, 100);
    }

    window.resetSnake = function() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        direction = {x: 1, y: 0};
        nextDirection = {x: 1, y: 0};
        score = 0;
        gameRunning = true;
        document.getElementById('snakeScore').textContent = score;
        update();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w') nextDirection = {x: 0, y: -1};
        if (e.key === 'ArrowDown' || e.key === 's') nextDirection = {x: 0, y: 1};
        if (e.key === 'ArrowLeft' || e.key === 'a') nextDirection = {x: -1, y: 0};
        if (e.key === 'ArrowRight' || e.key === 'd') nextDirection = {x: 1, y: 0};
    });

    drawGame();
    update();
}
