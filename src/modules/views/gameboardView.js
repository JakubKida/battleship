import { SHIP_LENGTHS, SHIP_TYPES } from '../helpers/helpers';

const gameboardView = (() => {
  const renderCell = (x, y, status, isHidden) => {
    let cell = document.createElement('div');
    // if (isHidden) {
    //   switch (status) {
    //   }
    // }
    cell.classList.add(`cell`, `${status}`);
    cell.dataset.x = x;
    cell.dataset.y = y;
    return cell;
  };

  const renderGrid = (boardNr, gameboard, isHidden) => {
    const board = document.querySelector(`#board-${boardNr}`);
    board.innerHTML = '';
    board.style.display = 'grid';
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        let status;

        switch (gameboard.board[i][j]) {
          case 'MISS':
            status = 'miss';
            break;
          case 'HIT':
            status = 'hit';
            break;
          case 'SUNK':
            status = 'sunk';
            break;
          default:
            status = 'hidden';
            break;
        }

        if (
          !isHidden &&
          typeof gameboard.board[i][j] === 'object' &&
          gameboard.board[i][j] !== null &&
          !Array.isArray(gameboard.board[i][j])
        )
          status = gameboard.board[i][j].ship.id;
        // let cell = document.createElement();
        board.append(renderCell(i, j, status, isHidden));
      }
    }
  };

  const hideDraggableShipsArea = () => {
    let shipsArea1 = document.querySelector(`#dragable-ships-1`);
    let shipsArea2 = document.querySelector(`#dragable-ships-2`);
    shipsArea1.style.display = 'none';
    shipsArea2.style.display = 'none';
    // document.documentElement.style.setProperty('--base-board-size', '40vh');
  };

  const renderDraggableShips = (playerNr) => {
    let shipsArea = document.querySelector(`#dragable-ships-${playerNr}`);
    // document.documentElement.style.setProperty('--base-board-size', '35vh');
    shipsArea.style.display = 'flex';
    shipsArea.innerHTML = '';
    shipsArea.classList.add('draggable-ships-area');
    SHIP_TYPES.forEach((shipType) => {
      let ship = renderDraggableShip(shipType);
      shipsArea.append(ship);
    });
  };

  const renderDraggableShip = (shipType) => {
    let area = document.createElement('div');
    area.classList.add(shipType);
    area.classList.add('draggable-ship');
    area.dataset.orientation = 'horizontal';
    area.dataset.name = shipType;
    let length = SHIP_LENGTHS[shipType];

    for (let i = 0; i <= length - 1; i++) {
      let cell = document.createElement('div');
      cell.classList.add('ship-draggable-cell');
      cell.classList.add(shipType);
      cell.dataset.index = i;
      area.append(cell);
    }
    // area.draggable = true;

    return area;
  };

  const clearGame = () => {
    document.querySelector(`#board-1`).innerHTML = '';
    document.querySelector(`#board-2`).innerHTML = '';
    document.querySelector(`#dragable-ships-1`).innerHTML = '';
    document.querySelector(`#dragable-ships-2`).innerHTML = '';
  };

  const renderWinner = (winner) => {
    const winBoard = document.querySelector(`#board-${winner}`);
    winBoard.style.display = 'block';
    const winMessage = document.createElement('div');
    winMessage.innerText = `Player ${winner} won the game !`;
    winMessage.classList.add('won');
    winBoard.innerHTML = '';
    winBoard.append(winMessage);

    let loser = winner === 1 ? 2 : 1;
    const lostBoard = document.querySelector(`#board-${loser}`);
    lostBoard.style.display = 'block';
    const loseMessage = document.createElement('div');
    loseMessage.innerHTML = `Player ${loser} lost the game !`;
    loseMessage.classList.add('lost');
    lostBoard.innerHTML = '';
    lostBoard.append(loseMessage);
  };
  const displayMessage = (message) => {
    const messageElement = document.querySelector('#message-box');
    messageElement.innerHTML = '';
    messageElement.innerText = message;
  };

  const hideArea = (gridNr) => {
    let areaToHide = document.querySelector(`#player-area-${gridNr}`);
    areaToHide.style.display = 'none';
  };

  const showArea = (gridNr) => {
    let areaToHide = document.querySelector(`#player-area-${gridNr}`);
    areaToHide.style.display = 'flex';
  };

  const renderPlayerChange = (playerNr) => {
    let popup = document.createElement('div');
    popup.classList.add('change-player-popup');
    let message = document.createElement('div');
    message.classList.add('change-player-message');
    message.innerText = `Player ${playerNr}'s turn`;
    popup.append(message);
    popup.addEventListener('click', () => {
      popup.remove();
    });
    document.querySelector('body').append(popup);
  };

  // const cipherGrid = (gridNr) => {
  //   const board = document.querySelector(`#board-${gridNr}`);
  //   const cells = board.querySelectorAll('.cell');

  //   cells.forEach(cell=>{

  //   })
  // }

  return {
    renderGrid,
    renderDraggableShips,
    renderWinner,
    displayMessage,
    hideArea,
    showArea,
    renderPlayerChange,
    clearGame,
    hideDraggableShipsArea,
  };
})();

export default gameboardView;
