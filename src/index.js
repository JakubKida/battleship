import Game from './modules/factories/game';

let resetButton = document.querySelector('#reset-game');
let selectType = document.querySelector('#game-type-selector');
let game = new Game(selectType.value);

game.initializeGame();

resetButton.addEventListener('click', () => {
  game = new Game(selectType.value);
  game.resetGame(selectType.value);
});
