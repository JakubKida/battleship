import { randXY, SHIP_TYPES } from '../helpers/helpers';
import Ship from './ship';

const Gameboard = () => {
  const board = [];
  const placedShips = [];

  //fill the board with null values
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = null;
    }
  }

  const getBoard = () => board;
  const areAllShipsPlaced = () => placedShips.length === SHIP_TYPES.length;

  //check if requested cell is valid (not already clicked/out of bounds)
  const checkCollision = (ship, x, y) => {
    for (let i = 0; i < ship.length; i++) {
      if (x <= 7 && y <= 7 && x >= 0 && y >= 0 && board[x][y] === null) {
        ship.getOrientation() !== 'horizontal' ? x++ : y++;
        continue;
      }
      return false;
    }
    return true;
  };

  const placeShip = (ship, x, y) => {
    const isValid = checkCollision(ship, x, y);
    if (isValid) {
      for (let i = 0; i < ship.length; i++) {
        board[x][y] = { ship, index: i };
        ship.getOrientation() !== 'horizontal' ? x++ : y++;
      }
      placedShips.push(ship);
    }
    return isValid;
  };

  const autoPlaceShip = (ship) => {
    let [x, y] = randXY();
    if (Math.random() > 0.5) ship.flip();

    while (!placeShip(ship, x, y)) {
      [x, y] = randXY();
      if (Math.random() > 0.5) ship.flip();
    }
    return true;
  };

  const autoPlaceFleet = () => {
    SHIP_TYPES.forEach((shipType) => {
      if (!autoPlaceShip(new Ship(shipType))) return false;
    });
    return true;
  };

  const areAllShipsSunk = () => {
    return placedShips.every((ship) => {
      return ship.isSunk();
    });
  };

  const receiveAttack = (x, y) => {
    // this functions returns an array in which 
    // the first value signals whether the move was made, and the second is the result
    if (x > 7 || x < 0 || y > 7 || y < 0) {
      return [false, 'OUT'];
    }

    if (
      board[x][y] === 'HIT' ||
      board[x][y] === 'SUNK' ||
      board[x][y] === 'MISS'
    ) {
      return [false, board[x][y]];
    }

    if (board[x][y] === null) {
      board[x][y] = 'MISS';
      return [true, board[x][y]];
    }

    //check if requested cell is an object
    if (
      typeof board[x][y] === 'object' &&
      board[x][y] !== null &&
      !Array.isArray(board[x][y])
    ) {
      board[x][y].ship.hit(board[x][y].index);

      if (board[x][y].ship.isSunk()) {
        board[x][y] = 'SUNK';
      } else {
        board[x][y] = 'HIT';
      }
      
      return [true, board[x][y]];
    }
  };
  return {
    board,
    placeShip,
    getBoard,
    receiveAttack,
    areAllShipsPlaced,
    autoPlaceShip,
    areAllShipsSunk,
    autoPlaceFleet,
  };
};

export default Gameboard;
