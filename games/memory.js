function initMemory() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Memory Game</h2>
        <div class="score-display">Найдено пар: <span id="memoryPairs">0</span>/8</div>
        <div id="memoryBoard" class="game-board" style="grid-template-columns: repeat(4, 1fr); gap: 8px;"></div>
        <div class="controls">
            <button onclick="resetMemory()">Новая игра</button>
        </div>
    `;

    const icons = ['🍎', '🍌', '🍒', '🍓', '🍎', '🍌', '🍒', '🍓',
                   '🎮', '🎲', '🎯', '🎪', '🎮', '🎲', '🎯', '🎪'];
    let shuffled = icons.sort(() => Math.random() - 0.5);
    let revealed = Array(16).fill(false);
    let matched = Array(16).fill(false);
    let [first, second] = [null, null];
    let pairs = 0;

    function render() {
        const board = document.getElementById('memoryBoard');
        board.innerHTML = '';
        shuffled.forEach((icon, i) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = revealed[i] || matched[i] ? icon : '?';
            tile.style.fontSize = '28px';
            tile.style.cursor = 'pointer';
            tile.style.background = matched[i] ? '#90EE90' : '#667eea';
            tile.style.color = 'white';
            tile.onclick = () => clickCard(i);
            board.appendChild(tile);
        });
    }

    function clickCard(index) {
        if (revealed[index] || matched[index] || first === index) return;

        revealed[index] = true;
        render();

        if (first === null) {
            first = index;
        } else {
            second = index;
            if (shuffled[first] === shuffled[second]) {
                matched[first] = true;
                matched[second] = true;
                pairs++;
                document.getElementById('memoryPairs').textContent = pairs;
                first = null;
                second = null;
                render();
                if (pairs === 8) alert('Вы выиграли! 🎉');
            } else {
                setTimeout(() => {
                    revealed[first] = false;
                    revealed[second] = false;
                    first = null;
                    second = null;
                    render();
                }, 600);
            }
        }
    }

    window.resetMemory = function() {
        shuffled = icons.sort(() => Math.random() - 0.5);
        revealed = Array(16).fill(false);
        matched = Array(16).fill(false);
        first = null;
        second = null;
        pairs = 0;
        document.getElementById('memoryPairs').textContent = 0;
        render();
    };

    render();
}
