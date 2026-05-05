function loadGame(gameName) {
    const gameContainer = document.getElementById('gameContainer');
    const gameContent = document.getElementById('gameContent');
    
    gameContent.innerHTML = '';
    gameContainer.classList.remove('hidden');
    
    switch(gameName) {
        case '2048':
            init2048();
            break;
        case 'snake':
            initSnake();
            break;
        case 'tictactoe':
            initTicTacToe();
            break;
        case 'memory':
            initMemory();
            break;
        case 'flappybird':
            initFlappyBird();
            break;
        case 'pong':
            initPong();
            break;
        case 'breakout':
            initBreakout();
            break;
        case 'tetris':
            initTetris();
            break;
        case 'minesweeper':
            initMinesweeper();
            break;
        case 'simon':
            initSimon();
            break;
        case 'pacman':
            initPacman();
            break;
        case 'hangman':
            initHangman();
            break;
    }
}

function closeGame() {
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('gameContent').innerHTML = '';
}

// Close game on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGame();
    }
});
