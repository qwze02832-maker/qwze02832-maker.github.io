function initBreakout() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Breakout</h2>
        <div class="score-display">Счёт: <span id="breakoutScore">0</span> | Жизни: <span id="breakoutLives">3</span></div>
        <canvas id="breakoutCanvas" width="500" height="400"></canvas>
        <div class="controls">
            <button onclick="resetBreakout()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">A/D или ← → для движения</p>
    `;

    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');

    let paddle = {x: canvas.width/2 - 40, y: canvas.height - 20, width: 80, height: 10, dx: 0};
    let ball = {x: canvas.width/2, y: canvas.height - 40, radius: 6, vx: 3, vy: -3};
    let bricks = [];
    let score = 0;
    let lives = 3;
    let gameRunning = true;

    // Create bricks
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            bricks.push({
                x: j * 60 + 5,
                y: i * 20 + 5,
                width: 55,
                height: 15,
                hit: false
            });
        }
    }

    function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw paddle
        ctx.fillStyle = '#667eea';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        // Draw ball
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw bricks
        bricks.forEach(brick => {
            if (!brick.hit) {
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                ctx.strokeStyle = '#388E3C';
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }

    function update() {
        paddle.x += paddle.dx;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx = -ball.vx;
        if (ball.y - ball.radius < 0) ball.vy = -ball.vy;

        // Paddle collision
        if (ball.y + ball.radius > paddle.y &&
            ball.y < paddle.y + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width) {
            ball.vy = -ball.vy;
        }

        // Brick collision
        bricks.forEach(brick => {
            if (!brick.hit &&
                ball.x > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y > brick.y &&
                ball.y < brick.y + brick.height) {
                brick.hit = true;
                ball.vy = -ball.vy;
                score += 10;
            }
        });

        if (ball.y > canvas.height) {
            lives--;
            if (lives <= 0) {
                gameRunning = false;
                alert('Конец игры! Финальный счёт: ' + score);
            } else {
                resetBall();
            }
        }

        document.getElementById('breakoutScore').textContent = score;
        document.getElementById('breakoutLives').textContent = lives;

        if (bricks.every(b => b.hit)) {
            alert('Вы выиграли! 🎉 Счёт: ' + score);
            gameRunning = false;
        }
    }

    function resetBall() {
        ball = {x: paddle.x + paddle.width/2, y: canvas.height - 40, radius: 6, vx: 3, vy: -3};
    }

    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    window.resetBreakout = function() {
        paddle = {x: canvas.width/2 - 40, y: canvas.height - 20, width: 80, height: 10, dx: 0};
        ball = {x: canvas.width/2, y: canvas.height - 40, radius: 6, vx: 3, vy: -3};
        bricks = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 8; j++) {
                bricks.push({x: j * 60 + 5, y: i * 20 + 5, width: 55, height: 15, hit: false});
            }
        }
        score = 0;
        lives = 3;
        gameRunning = true;
        document.getElementById('breakoutScore').textContent = score;
        document.getElementById('breakoutLives').textContent = lives;
        gameLoop();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') paddle.dx = -6;
        if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') paddle.dx = 6;
    });

    document.addEventListener('keyup', () => {
        paddle.dx = 0;
    });

    gameLoop();
}
