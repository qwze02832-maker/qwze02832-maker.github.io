function initHangman() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Hangman (Виселица)</h2>
        <div class="score-display" id="hangmanStatus">Угадайте слово</div>
        <div id="hangmanWord" style="text-align: center; font-size: 32px; letter-spacing: 10px; margin: 20px 0; font-weight: bold;"></div>
        <div style="text-align: center; color: #666; margin: 10px 0;">Попыток осталось: <span id="hangmanTries">6</span></div>
        <div id="hangmanLetters" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin: 20px 0;"></div>
        <div class="controls">
            <button onclick="resetHangman()">Новая игра</button>
        </div>
    `;

    const words = ['ПРОГРАММИРОВАНИЕ', 'КОМПЬЮТЕР', 'ИНТЕРНЕТ', 'ВИДЕОИГРА', 'ХОЛОДИЛЬНИК', 
                   'ТРАНСПОРТ', 'ПУТЕШЕСТВИЕ', 'МУЗЫКА', 'СПОРТ', 'КИНО', 'ШКОЛА', 'РАБОТА'];
    
    let word = '';
    let guessed = [];
    let tries = 6;
    let gameOverFlag = false;

    function startGame() {
        word = words[Math.floor(Math.random() * words.length)];
        guessed = [];
        tries = 6;
        gameOverFlag = false;
        renderLetters();
        renderWord();
        document.getElementById('hangmanTries').textContent = tries;
    }

    function renderWord() {
        let display = word.split('').map(letter => guessed.includes(letter) ? letter : '_').join(' ');
        document.getElementById('hangmanWord').textContent = display;
    }

    function renderLetters() {
        const container = document.getElementById('hangmanLetters');
        container.innerHTML = '';
        const alphabet = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
        
        alphabet.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.disabled = guessed.includes(letter);
            btn.style.width = '30px';
            btn.style.height = '30px';
            btn.style.padding = '5px';
            btn.onclick = () => guessLetter(letter);
            container.appendChild(btn);
        });
    }

    function guessLetter(letter) {
        if (gameOverFlag || guessed.includes(letter)) return;
        
        guessed.push(letter);

        if (!word.includes(letter)) {
            tries--;
            document.getElementById('hangmanTries').textContent = tries;
            if (tries <= 0) {
                gameOverFlag = true;
                document.getElementById('hangmanStatus').textContent = `Конец игры! Слово: ${word} 😢`;
                document.getElementById('hangmanStatus').className = 'score-display message error';
                return;
            }
        }

        renderLetters();
        renderWord();

        if (word.split('').every(l => guessed.includes(l))) {
            gameOverFlag = true;
            document.getElementById('hangmanStatus').textContent = 'Вы выиграли! 🎉';
            document.getElementById('hangmanStatus').className = 'score-display message success';
        }
    }

    window.resetHangman = function() {
        startGame();
        document.getElementById('hangmanStatus').textContent = 'Угадайте слово';
        document.getElementById('hangmanStatus').className = 'score-display';
    };

    startGame();
}
