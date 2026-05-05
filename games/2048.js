function init2048() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>2048</h2>
        <div class="score-display">Счёт: <span id="score2048">0</span></div>
        <div id="board2048" class="game-board" style="grid-template-columns: repeat(4, 1fr);"></div>
        <div class="controls">
            <button onclick="reset2048()">Новая игра</button>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em;">Используйте стрелки для движения</p>
    `;

    let board = Array(16).fill(0);
    let score = 0;

    function addNewTile() {
        let empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
        if (empty.length > 0) {
            let randomIndex = empty[Math.floor(Math.random() * empty.length)];
            board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function render() {
        const boardEl = document.getElementById('board2048');
        boardEl.innerHTML = '';
        board.forEach((value, i) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (value > 0) {
                tile.textContent = value;
                tile.style.background = getTileColor(value);
                tile.style.fontSize = value > 999 ? '20px' : '24px';
                tile.style.color = value <= 4 ? '#776e65' : '#f9f6f2';
            }
            boardEl.appendChild(tile);
        });
        document.getElementById('score2048').textContent = score;
    }

    function getTileColor(value) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        return colors[value] || '#3c3c2f';
    }

    function move(direction) {
        const prev = JSON.stringify(board);
        
        if (direction === 'ArrowLeft' || direction === 'a') moveLine('left');
        else if (direction === 'ArrowRight' || direction === 'd') moveLine('right');
        else if (direction === 'ArrowUp' || direction === 'w') moveLine('up');
        else if (direction === 'ArrowDown' || direction === 's') moveLine('down');

        if (JSON.stringify(board) !== prev) {
            addNewTile();
            render();
            checkGameOver();
        }
    }

    function moveLine(direction) {
        if (direction === 'left') {
            for (let i = 0; i < 4; i++) {
                const row = [board[i*4], board[i*4+1], board[i*4+2], board[i*4+3]];
                const moved = slideAndMerge(row);
                for (let j = 0; j < 4; j++) board[i*4+j] = moved[j];
            }
        } else if (direction === 'right') {
            for (let i = 0; i < 4; i++) {
                const row = [board[i*4+3], board[i*4+2], board[i*4+1], board[i*4]];
                const moved = slideAndMerge(row);
                for (let j = 0; j < 4; j++) board[i*4+3-j] = moved[j];
            }
        } else if (direction === 'up') {
            for (let j = 0; j < 4; j++) {
                const col = [board[j], board[j+4], board[j+8], board[j+12]];
                const moved = slideAndMerge(col);
                for (let i = 0; i < 4; i++) board[i*4+j] = moved[i];
            }
        } else if (direction === 'down') {
            for (let j = 0; j < 4; j++) {
                const col = [board[j+12], board[j+8], board[j+4], board[j]];
                const moved = slideAndMerge(col);
                for (let i = 0; i < 4; i++) board[12-i*4+j] = moved[i];
            }
        }
    }

    function slideAndMerge(line) {
        let result = line.filter(v => v !== 0);
        
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] === result[i + 1]) {
                result[i] *= 2;
                score += result[i];
                result.splice(i + 1, 1);
            }
        }
        
        while (result.length < 4) result.push(0);
        return result;
    }

    function checkGameOver() {
        if (canMove()) return;
        setTimeout(() => alert('Конец игры! Финальный счёт: ' + score), 100);
    }

    function canMove() {
        for (let i = 0; i < 16; i++) {
            if (board[i] === 0) return true;
            if (i % 4 < 3 && board[i] === board[i+1]) return true;
            if (i < 12 && board[i] === board[i+4]) return true;
        }
        return false;
    }

    window.reset2048 = function() {
        board = Array(16).fill(0);
        score = 0;
        addNewTile();
        addNewTile();
        render();
    };

    document.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(e.key)) {
            e.preventDefault();
            move(e.key);
        }
    });

    addNewTile();
    addNewTile();
    render();
}
