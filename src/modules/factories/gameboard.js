import { randXY, SHIP_TYPES } from '../helpers/helpers';
import Ship from './ship';

const Gameboard = () => {
  const board = [];
  const placedShips = [];
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = null;
    }
  }

  const getBoard = () => board;
  const areAllShipsPlaced = () => placedShips.length === SHIP_TYPES.length;
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

  const areAllShipsSunk = () => {
    return placedShips.every((ship) => {
      return ship.isSunk();
    });
  };

  const receiveAttack = (x, y) => {
    if (board[x][y] === null) {
      board[x][y] = 'MISS';
      return true;
    }
    if (
      board[x][y] === 'HIT' ||
      board[x][y] === 'MISS' ||
      x > 7 ||
      x < 0 ||
      y > 7 ||
      y < 0
    ) {
      return false;
    }
    if (
      typeof board[x][y] === 'object' &&
      board[x][y] !== null &&
      !Array.isArray(board[x][y])
    ) {
      board[x][y].ship.hit(board[x][y].index);
      board[x][y] = 'HIT';
      return true;
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
  };
};

export default Gameboard;
