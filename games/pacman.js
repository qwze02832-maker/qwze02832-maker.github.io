function initPacman() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Pac-Man</h2>
        <div class="score-display">Счёт: <span id="pacmanScore">0</span></div>
        <canvas id="pacmanCanvas" width="400" height="400"></canvas>
        <div class="controls">
            <button onclick="resetPacman()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">Используйте стрелки для движения</p>
    `;

    const canvas = document.getElementById('pacmanCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    let pacman = {x: 10, y: 10, direction: {x: 1, y: 0}};
    let ghosts = [
        {x: 5, y: 5, color: '#FF0000'},
        {x: 15, y: 5, color: '#00FFFF'},
        {x: 5, y: 15, color: '#FFB8FF'},
        {x: 15, y: 15, color: '#FFB847'}
    ];
    let dots = [];
    let score = 0;
    let gameRunning = true;

    // Create dots
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (Math.random() > 0.1) dots.push({x: i, y: j});
        }
    }

    function draw() {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dots
        ctx.fillStyle = '#FFCCDD';
        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x * gridSize + gridSize/2, dot.y * gridSize + gridSize/2, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Pacman
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(pacman.x * gridSize + gridSize/2, pacman.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw ghosts
        ghosts.forEach(ghost => {
            ctx.fillStyle = ghost.color;
            ctx.fillRect(ghost.x * gridSize + 1, ghost.y * gridSize + 1, gridSize - 2, gridSize - 2);
            ctx.fillStyle = '#FFF';
            ctx.fillRect(ghost.x * gridSize + 4, ghost.y * gridSize + 4, 3, 3);
            ctx.fillRect(ghost.x * gridSize + 13, ghost.y * gridSize + 4, 3, 3);
        });
    }

    function update() {
        pacman.x += pacman.direction.x;
        pacman.y += pacman.direction.y;

        if (pacman.x < 0 || pacman.x >= 20 || pacman.y < 0 || pacman.y >= 20) {
            pacman.x = (pacman.x + 20) % 20;
            pacman.y = (pacman.y + 20) % 20;
        }

        // Eat dots
        dots = dots.filter(dot => {
            if (dot.x === pacman.x && dot.y === pacman.y) {
                score += 10;
                return false;
            }
            return true;
        });

        // Move ghosts
        ghosts.forEach(ghost => {
            let dx = Math.sign(pacman.x - ghost.x);
            let dy = Math.sign(pacman.y - ghost.y);
            if (Math.random() > 0.7) {
                ghost.x += dx;
                ghost.y += dy;
            } else {
                if (Math.random() > 0.5) ghost.x += Math.sign(Math.random() - 0.5);
                if (Math.random() > 0.5) ghost.y += Math.sign(Math.random() - 0.5);
            }
            ghost.x = (ghost.x + 20) % 20;
            ghost.y = (ghost.y + 20) % 20;

            if (ghost.x === pacman.x && ghost.y === pacman.y) {
                gameRunning = false;
                alert('Конец игры! Счёт: ' + score);
            }
        });

        document.getElementById('pacmanScore').textContent = score;
    }

    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    window.resetPacman = function() {
        pacman = {x: 10, y: 10, direction: {x: 1, y: 0}};
        ghosts = [
            {x: 5, y: 5, color: '#FF0000'},
            {x: 15, y: 5, color: '#00FFFF'},
            {x: 5, y: 15, color: '#FFB8FF'},
            {x: 15, y: 15, color: '#FFB847'}
        ];
        dots = [];
        score = 0;
        gameRunning = true;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if (Math.random() > 0.1) dots.push({x: i, y: j});
            }
        }
        document.getElementById('pacmanScore').textContent = score;
        gameLoop();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w') pacman.direction = {x: 0, y: -1};
        if (e.key === 'ArrowDown' || e.key === 's') pacman.direction = {x: 0, y: 1};
        if (e.key === 'ArrowLeft' || e.key === 'a') pacman.direction = {x: -1, y: 0};
        if (e.key === 'ArrowRight' || e.key === 'd') pacman.direction = {x: 1, y: 0};
    });

    draw();
    setInterval(gameLoop, 100);
}
