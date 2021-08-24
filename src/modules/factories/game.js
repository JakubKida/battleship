import Gameboard from './gameboard';
import Player from './player';
import gameboardView from '../views/gameboardView';
import Ship from './ship';

const Game = (type) => {
  let playerOne = new Player();
  let playerTwo = new Player(type);

  let p1Gameboard = new Gameboard();
  let p2Gameboard = new Gameboard();

  const initializeGame = () => {
    if (playerTwo.getType() === 'pc') {
      p2Gameboard.autoPlaceFleet();
    } else {
      gameboardView.renderDraggableShips(2);
    }
    gameboardView.renderDraggableShips(1);
    displayGridsPlaceStage(1);
  };

  //functions for dragging and placing ships
  const displayGridsPlaceStage = (playerNr) => {
    gameboardView.renderGrid(1, p1Gameboard);
    gameboardView.renderGrid(2, p2Gameboard);
    gameboardView.hideArea(playerNr === 1 ? 2 : 1);
    gameboardView.showArea(playerNr === 1 ? 1 : 2);
    addDragEventListeners(playerNr);
  };

  const addDragEventListeners = (playerNr) => {
    gameboardView.displayMessage(`Player ${playerNr} : Place your fleet`);
    let playerArea = document.querySelector(`#player-area-${playerNr}`);

    let gridCells = playerArea.querySelectorAll(`#board-${playerNr} .cell`);
    gridCells.forEach((cell) => {
      cell.addEventListener('drop', drop);
      cell.addEventListener('dragover', (e) => e.preventDefault());
    });

    let dragCells = playerArea.querySelectorAll('.ship-draggable-cell');
    dragCells.forEach((dragCell) =>
      dragCell.addEventListener('mouseover', storeClickedIndex)
    );

    let draggableShips = playerArea.querySelectorAll('.draggable-ship');
    draggableShips.forEach((draggableShip) => {
      draggableShip.draggable = true;
      draggableShip.addEventListener('dragstart', dragStart);
      draggableShip.addEventListener('dblclick', flipDraggableShip);
    });

    let notDraggableShips = document.querySelectorAll(
      `#player-area-${playerNr === 1 ? 2 : 1} .draggable-ship`
    );
    notDraggableShips.forEach(
      (notDraggableShip) => (notDraggableShip.draggable = false)
    );
  };

  const dragStart = (event) => {
    event.dataTransfer.setData('name', event.target.dataset.name);
    event.dataTransfer.setData('index', event.target.dataset.clickedIndex);
    event.dataTransfer.setData('orientation', event.target.dataset.orientation);
  };

  const flipDraggableShip = (event) => {
    event.currentTarget.dataset.orientation =
      event.currentTarget.dataset.orientation === 'vertical'
        ? 'horizontal'
        : 'vertical';
  };

  const storeClickedIndex = (event) => {
    event.target.closest('.draggable-ship').dataset.clickedIndex =
      event.target.dataset.index;
  };

  const drop = (event) => {
    let boardToPlace;
    let x = event.target.dataset.x;
    let y = event.target.dataset.y;
    const playerNr = event.target.closest('.board').dataset.id;
    const type = event.dataTransfer.getData('name');
    const orientation = event.dataTransfer.getData('orientation');
    const indexToOffset = event.dataTransfer.getData('index');

    //offset the index at which to place ship based on which index was clicked when dragging
    if (orientation === 'horizontal') {
      y -= indexToOffset;
    } else {
      x -= indexToOffset;
    }

    //chose the board to place ship to
    if (playerNr === '1') {
      boardToPlace = p1Gameboard;
    } else {
      boardToPlace = p2Gameboard;
    }

    //flip the ship if it has 'vertical' class
    const shipToPlace = new Ship(type);
    if (orientation === 'vertical') shipToPlace.flip();

    //if placed correctly, remove the ship from draggable ones
    if (boardToPlace.placeShip(shipToPlace, x, y)) {
      const dragableToDelete = document.querySelector(
        `#player-area-${playerNr} .${type}.draggable-ship`
      );
      dragableToDelete.remove();
    }
    //start the round if all ships are places on both boards
    if (p1Gameboard.areAllShipsPlaced() && p2Gameboard.areAllShipsPlaced()) {
      displayGridsPlayStage(1);
    } else {
      if (playerTwo.getType() !== 'pc') {
        if (p1Gameboard.areAllShipsPlaced()) {
          displayGridsPlaceStage(2);
        } else {
          displayGridsPlaceStage(1);
        }
      } else {
        displayGridsPlaceStage(1);
      }
    }
  };

  // functions for playing the game (atacking stage)

  const displayGridsPlayStage = (playerNr) => {
    const isPlayerOneHidden = playerNr !== 1 ? true : false;
    const isPlayerTwoHidden = playerNr !== 2 ? true : false;

    //render the move for the current player to see for a few seconds
    gameboardView.renderGrid(1, p1Gameboard, !isPlayerOneHidden);
    gameboardView.renderGrid(2, p2Gameboard, !isPlayerTwoHidden);

    //then
    if (playerTwo.getType() === 'pc') {
      gameboardView.showArea(1);
      gameboardView.showArea(2);
      gameboardView.renderGrid(1, p1Gameboard, false);
      gameboardView.renderGrid(2, p2Gameboard, true);
      addCellEventListeners(playerNr);
    } else {
      setTimeout(() => {
        gameboardView.showArea(1);
        gameboardView.showArea(2);
        gameboardView.renderPlayerChange(playerNr);
        gameboardView.renderGrid(1, p1Gameboard, isPlayerOneHidden);
        gameboardView.renderGrid(2, p2Gameboard, isPlayerTwoHidden);
        addCellEventListeners(playerNr);
      }, 1000);
    }
  };

  const addCellEventListeners = (playerNr) => {
    gameboardView.displayMessage(`Player ${playerNr}' turn`);
    let cellsToRemove = document.querySelectorAll(`#board-${playerNr} > .cell`);
    let cellsToAdd = document.querySelectorAll(
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

    if (p1Gameboard.areAllShipsSunk() || p2Gameboard.areAllShipsSunk()) {
      endGame();
      return;
    }

    if (playerTwo.getType() === 'pc') {
      playerTwo.autoAttack(p1Gameboard);
      displayGridsPlayStage(1);
    } else {
      displayGridsPlayStage(boardToAttack === '1' ? 1 : 2);
    }
  };

  const endGame = () => {
    let winner;
    if (p1Gameboard.areAllShipsSunk()) {
      winner = 1;
    } else if (p2Gameboard.areAllShipsSunk()) {
      winner = 2;
    }
    gameboardView.renderWinner(winner);
  };

  const resetGame = (type) => {
    playerOne = new Player();
    playerTwo = new Player(type);
    p1Gameboard = new Gameboard();
    p2Gameboard = new Gameboard();
    gameboardView.clearGame();
    initializeGame();
  };

  return { playerOne, playerTwo, resetGame, initializeGame };
};

export default Game;
