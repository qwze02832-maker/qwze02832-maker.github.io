function initSimon() {
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <h2>Simon Says</h2>
        <div class="score-display">Уровень: <span id="simonLevel">1</span></div>
        <div id="simonBoard" style="display: grid; grid-template-columns: repeat(2, 150px); gap: 10px; margin: 20px auto; width: fit-content;">
            <div id="simonRed" style="width: 150px; height: 150px; background: #FF5252; cursor: pointer; border-radius: 50%; border: 3px solid #CC0000;"></div>
            <div id="simonGreen" style="width: 150px; height: 150px; background: #4CAF50; cursor: pointer; border-radius: 50%; border: 3px solid #2E7D32;"></div>
            <div id="simonBlue" style="width: 150px; height: 150px; background: #2196F3; cursor: pointer; border-radius: 50%; border: 3px solid #1565C0;"></div>
            <div id="simonYellow" style="width: 150px; height: 150px; background: #FFD54F; cursor: pointer; border-radius: 50%; border: 3px solid #FBC02D;"></div>
        </div>
        <div class="controls">
            <button id="simonStartBtn" onclick="startSimon()">Начать</button>
        </div>
    `;

    const colors = ['red', 'green', 'blue', 'yellow'];
    const colorMap = {red: '#FF5252', green: '#4CAF50', blue: '#2196F3', yellow: '#FFD54F'};
    const lightColorMap = {red: '#FF8A80', green: '#81C784', blue: '#64B5F6', yellow: '#FFEE58'};

    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let isPlaying = false;
    let gameActive = false;

    colors.forEach(color => {
        document.getElementById('simon' + color.charAt(0).toUpperCase() + color.slice(1)).addEventListener('click', () => {
            if (gameActive && !isPlaying) playerClick(color);
        });
    });

    function playSound(color) {
        const el = document.getElementById('simon' + color.charAt(0).toUpperCase() + color.slice(1));
        el.style.background = lightColorMap[color];
        setTimeout(() => {
            el.style.background = colorMap[color];
        }, 200);
    }

    function playSequence() {
        isPlaying = true;
        playerSequence = [];

        let delay = 600;
        sequence.forEach((color, index) => {
            setTimeout(() => playSound(color), delay * (index + 1));
        });

        setTimeout(() => {
            isPlaying = false;
        }, delay * (sequence.length + 1));
    }

    function playerClick(color) {
        playSound(color);
        playerSequence.push(color);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            alert('Конец игры! Ваш уровень: ' + level);
            gameActive = false;
            document.getElementById('simonStartBtn').textContent = 'Начать';
            return;
        }

        if (playerSequence.length === sequence.length) {
            level++;
            document.getElementById('simonLevel').textContent = level;
            setTimeout(() => {
                sequence.push(colors[Math.floor(Math.random() * 4)]);
                playSequence();
            }, 1000);
        }
    }

    window.startSimon = function() {
        if (gameActive) return;
        sequence = [colors[Math.floor(Math.random() * 4)]];
        level = 1;
        gameActive = true;
        document.getElementById('simonStartBtn').textContent = 'Игра...';
        document.getElementById('simonLevel').textContent = level;
        playSequence();
    };
}
