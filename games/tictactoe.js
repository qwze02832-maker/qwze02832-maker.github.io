function initTicTacToe() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Tic-Tac-Toe</h2>
        <div id="tictactoeBoard" class="game-board" style="grid-template-columns: repeat(3, 1fr); max-width: 300px; margin: 20px auto;"></div>
        <div id="tictactoeStatus" class="score-display">Ходит X</div>
        <div class="controls">
            <button onclick="resetTicTacToe()">Новая игра</button>
        </div>
    `;

    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameOverFlag = false;

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function render() {
        const boardEl = document.getElementById('tictactoeBoard');
        boardEl.innerHTML = '';
        board.forEach((value, i) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = value;
            tile.style.fontSize = '32px';
            tile.style.fontWeight = 'bold';
            tile.style.cursor = 'pointer';
            tile.style.background = value ? '#667eea' : '#f0f0f0';
            tile.style.color = value ? 'white' : '#333';
            tile.onclick = () => makeMove(i);
            boardEl.appendChild(tile);
        });
    }

    function makeMove(index) {
        if (board[index] === '' && !gameOverFlag) {
            board[index] = currentPlayer;
            checkWinner();
            if (!gameOverFlag) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (currentPlayer === 'O') aiMove();
            }
            render();
        }
    }

    function aiMove() {
        let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        if (empty.length > 0) {
            let randomIndex = empty[Math.floor(Math.random() * empty.length)];
            board[randomIndex] = 'O';
            checkWinner();
            if (!gameOverFlag) currentPlayer = 'X';
        }
    }

    function checkWinner() {
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                document.getElementById('tictactoeStatus').textContent = `${board[a]} выиграл! 🎉`;
                document.getElementById('tictactoeStatus').className = 'score-display message success';
                gameOverFlag = true;
                return;
            }
        }
        if (board.every(v => v !== '')) {
            document.getElementById('tictactoeStatus').textContent = 'Ничья!';
            document.getElementById('tictactoeStatus').className = 'score-display message';
            gameOverFlag = true;
        } else {
            document.getElementById('tictactoeStatus').textContent = `Ходит ${currentPlayer}`;
            document.getElementById('tictactoeStatus').className = 'score-display';
        }
    }

    window.resetTicTacToe = function() {
        board = Array(9).fill('');
        currentPlayer = 'X';
        gameOverFlag = false;
        render();
        checkWinner();
    };

    render();
}
