const gameboardView = (() => {
  const renderCell = (x, y, status) => {
    let cell = document.createElement('div');
    cell.classList.add(`cell`, `${status}`);
    cell.dataset.x = x;
    cell.dataset.y = y;
    return cell;
  };

  const renderGrid = (boardNr, gameboard) => {
    const board = document.querySelector(`#board-${boardNr}`);
    board.innerHTML = '';
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
          default:
            status = 'hidden';
            break;
        }

        if (
          typeof gameboard.board[i][j] === 'object' &&
          gameboard.board[i][j] !== null &&
          !Array.isArray(gameboard.board[i][j])
        )
          status = gameboard.board[i][j].ship.id;
        // let cell = document.createElement();
        board.append(renderCell(i, j, status));
      }
    }
  };
  return { renderGrid };
})();

export default gameboardView;
