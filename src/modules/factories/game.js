import Gameboard from './gameboard';
import Player from './player';
import gameboardView from '../views/gameboardView';

const Game = (type) => {
  let playerOne = new Player();
  let playerTwo = new Player(type);

  let p1Gameboard = new Gameboard();
  let p2Gameboard = new Gameboard();

  const initializeGame = () => {
    p1Gameboard.autoPlaceFleet();
    p2Gameboard.autoPlaceFleet();
    displayGrids();
    addCellEventListeners(2);
  };

  const displayGrids = () => {
    gameboardView.renderGrid(1, p1Gameboard);
    gameboardView.renderGrid(2, p2Gameboard);
  };

  const addCellEventListeners = (playerNr) => {
    let cellsToAdd = document.querySelectorAll(`#board-${playerNr} > .cell`);
    let cellsToRemove = document.querySelectorAll(
      `#board-${playerNr === 1 ? 2 : 1} > .cell`
    );

    cellsToAdd.forEach((cell) => {
      cell.addEventListener('click', attackBoard);
    });

    cellsToRemove.forEach((cell) => {
      cell.removeEventListener('click', attackBoard);
    });
  };

  const attackBoard = (e) => {
    const boardToAttack = e.currentTarget.closest('.board').dataset.id;
    const x = e.currentTarget.dataset.x;
    const y = e.currentTarget.dataset.y;
    if (boardToAttack === '1') {
      if (!playerTwo.attack(p1Gameboard, x, y)) return;
    } else if (boardToAttack === '2') {
      if (!playerOne.attack(p2Gameboard, x, y)) return;
    }

    if (playerTwo.getType() === 'pc') {
      playerTwo.autoAttack(p1Gameboard);
      displayGrids();
      addCellEventListeners(2);
    } else {
      displayGrids();
      addCellEventListeners(boardToAttack === '1' ? 2 : 1);
    }

    if (p1Gameboard.areAllShipsSunk() || p2Gameboard.areAllShipsSunk()) {
      resetGame();
      initializeGame();
    }
  };

  const resetGame = (type) => {
    playerOne = new Player();
    playerTwo = new Player();
    p1Gameboard = new Gameboard();
    p2Gameboard = new Gameboard();
    initializeGame();
  };

  return { playerOne, playerTwo, displayGrids, resetGame, initializeGame };
};

export default Game;
