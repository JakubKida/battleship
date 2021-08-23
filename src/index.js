import Game from './modules/factories/game';

const game = new Game('human');

// game.displayGrids();
game.initializeGame();
let resetButton = document.querySelector('#reset-game');
resetButton.addEventListener('click', game.resetGame);
