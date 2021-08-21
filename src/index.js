import Game from './modules/factories/game';

const game = new Game('pc');

// game.displayGrids();
game.initializeGame();
let resetButton = document.querySelector('#reset-game');
resetButton.addEventListener('click', game.resetGame);
