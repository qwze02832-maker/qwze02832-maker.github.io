function initFlappyBird() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Flappy Bird</h2>
        <div class="score-display">Счёт: <span id="flappyScore">0</span></div>
        <canvas id="flappyCanvas" width="400" height="500"></canvas>
        <div class="controls">
            <button onclick="resetFlappyBird()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">Нажимайте или кликайте для полёта</p>
    `;

    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');

    let bird = {x: 50, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jump: -12};
    let pipes = [];
    let score = 0;
    let gameRunning = true;
    let frameCount = 0;

    function drawBird() {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(bird.x + 10, bird.y + 10, 5, 5);
    }

    function drawPipes() {
        ctx.fillStyle = '#4CAF50';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
            ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
        });
    }

    function updateBird() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            endGame();
        }
    }

    function updatePipes() {
        pipes.forEach(pipe => pipe.x -= 5);
        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

        if (frameCount % 80 === 0) {
            let gapSize = 120;
            let gapPosition = Math.random() * (canvas.height - gapSize - 100) + 50;
            pipes.push({
                x: canvas.width,
                width: 60,
                top: gapPosition,
                bottom: gapPosition + gapSize
            });
        }
    }

    function checkCollision() {
        pipes.forEach(pipe => {
            if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
                if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
                    endGame();
                } else if (pipe.x === bird.x) {
                    score++;
                    document.getElementById('flappyScore').textContent = score;
                }
            }
        });
    }

    function endGame() {
        gameRunning = false;
        alert('Конец игры! Счёт: ' + score);
    }

    function draw() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
    }

    function gameLoop() {
        if (!gameRunning) return;
        frameCount++;
        updateBird();
        updatePipes();
        checkCollision();
        draw();
        requestAnimationFrame(gameLoop);
    }

    window.resetFlappyBird = function() {
        bird = {x: 50, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jump: -12};
        pipes = [];
        score = 0;
        gameRunning = true;
        frameCount = 0;
        document.getElementById('flappyScore').textContent = score;
        gameLoop();
    };

    document.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && gameRunning) {
            e.preventDefault();
            bird.velocity = bird.jump;
        }
    });

    canvas.addEventListener('click', () => {
        if (gameRunning) bird.velocity = bird.jump;
    });

    gameLoop();
}
