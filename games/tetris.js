function initTetris() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Tetris</h2>
        <div class="score-display">Счёт: <span id="tetrisScore">0</span></div>
        <canvas id="tetrisCanvas" width="300" height="400"></canvas>
        <div class="controls">
            <button onclick="resetTetris()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">← → Движение, ↑ Вращение, ↓ Быстро</p>
    `;

    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const blockSize = 30;
    const cols = 10, rows = 13;

    let board = Array(rows * cols).fill(0);
    let score = 0;
    let gameRunning = true;

    const pieces = [
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[1,1,0],[0,1,1]],
        [[0,1,1],[1,1,0]],
        [[1,1,1],[0,1,0]],
        [[1,1,1],[1,0,0]],
        [[1,1,1],[0,0,1]]
    ];

    const colors = ['#FF5252', '#FF9800', '#FFC107', '#8BC34A', '#00BCD4', '#2196F3', '#9C27B0'];

    let currentPiece = {
        shape: pieces[Math.floor(Math.random() * pieces.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        x: 3,
        y: 0
    };

    function draw() {
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ccc';
        for (let i = 0; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * blockSize, 0);
            ctx.lineTo(i * blockSize, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * blockSize);
            ctx.lineTo(canvas.width, i * blockSize);
            ctx.stroke();
        }

        // Draw board
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (board[i * cols + j]) {
                    ctx.fillStyle = board[i * cols + j];
                    ctx.fillRect(j * blockSize, i * blockSize, blockSize - 1, blockSize - 1);
                }
            }
        }

        // Draw current piece
        currentPiece.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect((currentPiece.x + j) * blockSize, (currentPiece.y + i) * blockSize, blockSize - 1, blockSize - 1);
                }
            });
        });
    }

    function canMove(piece, offsetX, offsetY) {
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                if (piece.shape[i][j]) {
                    let x = piece.x + j + offsetX;
                    let y = piece.y + i + offsetY;
                    if (x < 0 || x >= cols || y >= rows) return false;
                    if (y >= 0 && board[y * cols + x]) return false;
                }
            }
        }
        return true;
    }

    function placePiece() {
        currentPiece.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    let x = currentPiece.x + j;
                    let y = currentPiece.y + i;
                    if (y >= 0 && y < rows && x >= 0 && x < cols) {
                        board[y * cols + x] = currentPiece.color;
                    }
                }
            });
        });
        clearLines();
        newPiece();
    }

    function clearLines() {
        for (let i = rows - 1; i >= 0; i--) {
            let full = true;
            for (let j = 0; j < cols; j++) {
                if (!board[i * cols + j]) {
                    full = false;
                    break;
                }
            }
            if (full) {
                board.splice(i * cols, cols);
                board.unshift(...Array(cols).fill(0));
                score += 100;
            }
        }
    }

    function newPiece() {
        currentPiece = {
            shape: pieces[Math.floor(Math.random() * pieces.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            x: 3,
            y: 0
        };
        if (!canMove(currentPiece, 0, 0)) {
            gameRunning = false;
            alert('Конец игры! Счёт: ' + score);
        }
    }

    function update() {
        if (!canMove(currentPiece, 0, 1)) {
            placePiece();
        } else {
            currentPiece.y++;
        }
    }

    function gameLoop() {
        if (!gameRunning) return;
        update();
        draw();
        document.getElementById('tetrisScore').textContent = score;
        setTimeout(gameLoop, 500);
    }

    window.resetTetris = function() {
        board = Array(rows * cols).fill(0);
        score = 0;
        gameRunning = true;
        currentPiece = {
            shape: pieces[Math.floor(Math.random() * pieces.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            x: 3,
            y: 0
        };
        document.getElementById('tetrisScore').textContent = score;
        gameLoop();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') canMove(currentPiece, -1, 0) && (currentPiece.x--);
        if (e.key === 'ArrowRight') canMove(currentPiece, 1, 0) && (currentPiece.x++);
        if (e.key === 'ArrowDown') update();
        if (e.key === 'ArrowUp') {
            let rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(r => r[i])).reverse();
            let original = currentPiece.shape;
            currentPiece.shape = rotated;
            if (!canMove(currentPiece, 0, 0)) currentPiece.shape = original;
        }
    });

    draw();
    gameLoop();
}
