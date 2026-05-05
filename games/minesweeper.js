function initMinesweeper() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Minesweeper</h2>
        <div class="score-display">Флаги: <span id="mineFlags">10</span> | Найдено: <span id="mineFound">0</span>/10</div>
        <div id="mineBoardContainer" style="display: inline-block; margin: 20px auto; border: 2px solid #333;"></div>
        <div class="controls">
            <button onclick="resetMinesweeper()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">Клик - открыть, Правый клик - флаг</p>
    `;

    const size = 10;
    const mines = 10;
    let board = Array(size * size).fill(0);
    let revealed = Array(size * size).fill(false);
    let flagged = Array(size * size).fill(false);
    let gameOverFlag = false;
    let flagsPlaced = 0;
    let correctFlags = 0;

    // Place mines
    for (let i = 0; i < mines; i++) {
        let pos;
        do {
            pos = Math.floor(Math.random() * (size * size));
        } while (board[pos] === 'M');
        board[pos] = 'M';
    }

    // Calculate numbers
    for (let i = 0; i < size * size; i++) {
        if (board[i] !== 'M') {
            let count = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let ni = i + dy * size + dx;
                    if (ni >= 0 && ni < size * size && Math.abs(dx) + Math.abs(dy) <= 1 && board[ni] === 'M') count++;
                }
            }
            board[i] = count;
        }
    }

    function render() {
        const container = document.getElementById('mineBoardContainer');
        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${size}, 25px)`;
        container.style.gap = '1px';
        container.style.background = '#999';
        container.style.padding = '5px';

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.style.width = '25px';
            cell.style.height = '25px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '12px';
            cell.style.fontWeight = 'bold';
            cell.style.cursor = 'pointer';
            cell.style.userSelect = 'none';

            if (flagged[i]) {
                cell.textContent = '🚩';
                cell.style.background = '#FFC107';
            } else if (revealed[i]) {
                cell.style.background = '#ddd';
                if (board[i] === 'M') {
                    cell.textContent = '💣';
                } else if (board[i] > 0) {
                    cell.textContent = board[i];
                    cell.style.color = ['', 'blue', 'green', 'red', 'darkblue', 'darkred', 'teal', 'black', 'gray'][board[i]];
                }
            } else {
                cell.style.background = '#bbb';
                cell.style.border = '2px solid #999';
            }

            cell.onclick = (e) => revealCell(i);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFlag(i);
            };

            container.appendChild(cell);
        }
    }

    function revealCell(index) {
        if (gameOverFlag || revealed[index] || flagged[index]) return;

        revealed[index] = true;

        if (board[index] === 'M') {
            gameOverFlag = true;
            alert('💣 Вы наступили на мину!');
            revealAll();
        } else if (board[index] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let ni = index + dy * size + dx;
                    if (ni >= 0 && ni < size * size && !revealed[ni] && !(dy === 0 && dx === 0)) {
                        revealCell(ni);
                    }
                }
            }
        }

        checkWin();
        render();
    }

    function toggleFlag(index) {
        if (revealed[index]) return;
        if (flagged[index]) {
            flagged[index] = false;
            flagsPlaced--;
            if (board[index] === 'M') correctFlags--;
        } else {
            if (flagsPlaced < mines) {
                flagged[index] = true;
                flagsPlaced++;
                if (board[index] === 'M') correctFlags++;
            }
        }
        document.getElementById('mineFlags').textContent = mines - flagsPlaced;
        document.getElementById('mineFound').textContent = correctFlags;
        render();
    }

    function revealAll() {
        revealed = Array(size * size).fill(true);
        render();
    }

    function checkWin() {
        let won = true;
        for (let i = 0; i < size * size; i++) {
            if (board[i] !== 'M' && !revealed[i]) {
                won = false;
                break;
            }
        }
        if (won) {
            gameOverFlag = true;
            alert('🎉 Вы выиграли!');
        }
    }

    window.resetMinesweeper = function() {
        board = Array(size * size).fill(0);
        revealed = Array(size * size).fill(false);
        flagged = Array(size * size).fill(false);
        gameOverFlag = false;
        flagsPlaced = 0;
        correctFlags = 0;
        document.getElementById('mineFlags').textContent = mines;
        document.getElementById('mineFound').textContent = 0;

        for (let i = 0; i < mines; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * (size * size));
            } while (board[pos] === 'M');
            board[pos] = 'M';
        }

        for (let i = 0; i < size * size; i++) {
            if (board[i] !== 'M') {
                let count = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let ni = i + dy * size + dx;
                        if (ni >= 0 && ni < size * size && Math.abs(dx) + Math.abs(dy) <= 1 && board[ni] === 'M') count++;
                    }
                }
                board[i] = count;
            }
        }

        render();
    };

    render();
}
