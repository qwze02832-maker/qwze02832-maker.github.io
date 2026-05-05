function initPong() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Pong</h2>
        <div class="score-display">Синий: <span id="pongScore1">0</span> | Красный: <span id="pongScore2">0</span></div>
        <canvas id="pongCanvas" width="600" height="400"></canvas>
        <div class="controls">
            <button onclick="resetPong()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">W/S - левая ракетка, ↑/↓ - правая ракетка</p>
    `;

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    let ball = {x: canvas.width/2, y: canvas.height/2, radius: 8, vx: 4, vy: 4};
    let paddle1 = {x: 10, y: canvas.height/2 - 40, width: 10, height: 80, dy: 0};
    let paddle2 = {x: canvas.width - 20, y: canvas.height/2 - 40, width: 10, height: 80, dy: 0};
    let score1 = 0, score2 = 0;
    let gameRunning = true;

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFF';
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function update() {
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.vy = -ball.vy;
        }

        if (ball.x - ball.radius < paddle1.x + paddle1.width &&
            ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
            ball.vx = -ball.vx;
            ball.x = paddle1.x + paddle1.width + ball.radius;
        }

        if (ball.x + ball.radius > paddle2.x &&
            ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
            ball.vx = -ball.vx;
            ball.x = paddle2.x - ball.radius;
        }

        if (ball.x < 0) {
            score2++;
            resetBall();
        } else if (ball.x > canvas.width) {
            score1++;
            resetBall();
        }

        paddle1.y += paddle1.dy;
        paddle2.y += paddle2.dy;

        if (paddle1.y < 0) paddle1.y = 0;
        if (paddle1.y + paddle1.height > canvas.height) paddle1.y = canvas.height - paddle1.height;
        if (paddle2.y < 0) paddle2.y = 0;
        if (paddle2.y + paddle2.height > canvas.height) paddle2.y = canvas.height - paddle2.height;

        document.getElementById('pongScore1').textContent = score1;
        document.getElementById('pongScore2').textContent = score2;
    }

    function resetBall() {
        ball = {x: canvas.width/2, y: canvas.height/2, radius: 8, vx: (Math.random() > 0.5 ? 4 : -4), vy: (Math.random() - 0.5) * 6};
    }

    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    window.resetPong = function() {
        ball = {x: canvas.width/2, y: canvas.height/2, radius: 8, vx: 4, vy: 4};
        paddle1 = {x: 10, y: canvas.height/2 - 40, width: 10, height: 80, dy: 0};
        paddle2 = {x: canvas.width - 20, y: canvas.height/2 - 40, width: 10, height: 80, dy: 0};
        score1 = 0;
        score2 = 0;
        gameRunning = true;
        document.getElementById('pongScore1').textContent = score1;
        document.getElementById('pongScore2').textContent = score2;
        gameLoop();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'w' || e.key === 'W') paddle1.dy = -6;
        if (e.key === 's' || e.key === 'S') paddle1.dy = 6;
        if (e.key === 'ArrowUp') paddle2.dy = -6;
        if (e.key === 'ArrowDown') paddle2.dy = 6;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') paddle1.dy = 0;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
    });

    gameLoop();
}
