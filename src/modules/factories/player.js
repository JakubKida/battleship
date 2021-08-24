import { randXY, SURROUND_CHECKS } from '../helpers/helpers';
import gameboardView from '../views/gameboardView';
import Ship from './ship';

const Player = (type = 'human') => {
  const previousMove = {
    continueAI: false,
    firstDirShipCoords: [],
    secondDirShipCoords: [],
    isAxisFound: false,
    correctAxis: null,
    surroundCheck: 0,
    checkDirection: 'backwards',
    isFirstDirChecked: false,
  };

  const getType = () => type;

  //reset fields for AI to start over
  const resetPreviousMovesData = () => {
    previousMove.continueAI = false;

    //surroundChecks stores how many surrounding cells to the HIT one were checked
    previousMove.surroundCheck = 0;

    //isAxisFound and correctAxis store information about axis found with surround checks
    previousMove.isAxisFound = false;
    previousMove.correctAxis = '';

    //array for storing checked cells in both directions separately
    previousMove.firstDirShipCoords = [];
    previousMove.secondDirShipCoords = [];

    //information about direction of axis check
    previousMove.checkDirection = 'backwards';
    previousMove.isFirstDirChecked = false;
  };

  //human attack
  const attack = (gameboard, x, y) => gameboard.receiveAttack(x, y)[0];

  //AI attack
  const autoAttack = (gameboard) => {
    if (previousMove.continueAI) {
      if (previousMove.isAxisFound) {
        directionAttack(gameboard);
      } else {
        findAxisAttack(gameboard);
      }
    } else {
      randomAttack(gameboard);
    }
  };

  const randomAttack = (gameboard) => {
    let [x, y] = randXY();

    //generate random XY until the attack is valid
    while (!gameboard.receiveAttack(x, y)[0]) {
      [x, y] = randXY();
    }

    //initiaite the AI if a cell was hit
    if (gameboard.getBoard()[x][y] === 'HIT') {
      previousMove.continueAI = true;
      //add the first cell to both direction arrays
      previousMove.firstDirShipCoords.push([x, y]);
      previousMove.secondDirShipCoords.push([x, y]);
    }

    return true;
  };

  const findAxisAttack = (gameboard) => {
    //check next surrounding cell
    let newX = previousMove.firstDirShipCoords[0][0] + SURROUND_CHECKS[previousMove.surroundCheck][0];
    let newY = previousMove.firstDirShipCoords[0][1] + SURROUND_CHECKS[previousMove.surroundCheck][1];
    previousMove.surroundCheck++;

    //repeat checking if the cells are out of bounds or were already checked
    while (!gameboard.receiveAttack(newX, newY)[0]) {
      newX = previousMove.firstDirShipCoords[0][0] + SURROUND_CHECKS[previousMove.surroundCheck][0];
      newY = previousMove.firstDirShipCoords[0][1] + SURROUND_CHECKS[previousMove.surroundCheck][1];
      previousMove.surroundCheck++;

      //if there were more than 4 checks (for every neighbour cell) finish and reset AI
      if (previousMove.surroundCheck > 4) {
        resetPreviousMovesData();
        autoAttack();
        return;
      }
    }

    //if the surrounding check resulted in a hit,
    //find the axis for further checking and store the hit cell for first direction
    if (gameboard.getBoard()[newX][newY] === 'HIT') {
      previousMove.firstDirShipCoords.push([newX, newY]);
      previousMove.isAxisFound = true;

      //based on SURROUND_CHECKS, determine the axis and first direction of checking
      switch (previousMove.surroundCheck - 1) {
        case 0:
          previousMove.correctAxis = 'y';
          previousMove.checkDirection = 'backwards';
          break;
        case 3:
          previousMove.correctAxis = 'y';
          previousMove.checkDirection = 'forward';
          break;
        case 1:
          previousMove.correctAxis = 'x';
          previousMove.checkDirection = 'backwards';
          break;
        case 2:
          previousMove.correctAxis = 'x';
          previousMove.checkDirection = 'forward';
          break;
        default:
          break;
      }
    } else if (gameboard.getBoard()[newX][newY] === 'SUNK') {
      //if the ship was sunk on surround checks, reset the AI
      resetPreviousMovesData();
    }

    return false;
  };

  const directionAttack = (gameboard) => {
    //get base XY from last element of current direction array
    let nextX, nextY;
    if (previousMove.isFirstDirChecked === false) {
      [nextX, nextY] = previousMove.firstDirShipCoords.slice(-1)[0];
      previousMove.firstDirCount++;
    } else {
      [nextX, nextY] = previousMove.secondDirShipCoords.slice(-1)[0];
      previousMove.secondDirCount++;
    }

    //offset XY based on axis and direction
    if (previousMove.correctAxis === 'x') {
      if (previousMove.checkDirection === 'forward') {
        nextY++;
      } else {
        nextY--;
      }
    } else if (previousMove.correctAxis === 'y') {
      if (previousMove.checkDirection === 'forward') {
        nextX++;
      } else {
        nextX--;
      }
    }

    if (!gameboard.receiveAttack(nextX, nextY)[0]) {
      if (previousMove.isFirstDirChecked) {
        //if attack failed and both directions were checked
        //end the AI and make a random move
        resetPreviousMovesData();
        autoAttack(gameboard);
        return;
      } else {
        //if attack failed and both directions are NOT checked
        //change the direction and make move again
        previousMove.isFirstDirChecked = true;
        previousMove.checkDirection = previousMove.checkDirection === 'forward' ? 'backwards' : 'forward';
        autoAttack(gameboard);
        return;
      }
    } else {
      let result = gameboard.receiveAttack(nextX, nextY)[1];

      switch (result) {
        case 'MISS':
          //if the placed cell was missed, reset AI or change Direction
          if (previousMove.isFirstDirChecked) {
            resetPreviousMovesData();
          } else {
            previousMove.isFirstDirChecked = true;
            previousMove.checkDirection = previousMove.checkDirection === 'forward' ? 'backwards' : 'forward';
          }
          break;
        case 'HIT':
          //if the placed cell was hit, push the placed cell info to appropriate direction array
          if (!previousMove.isFirstDirChecked) {
            previousMove.firstDirShipCoords.push([nextX, nextY]);
          } else {
            previousMove.secondDirShipCoords.push([nextX, nextY]);
          }
          break;
        case 'SUNK':
          //if the placed cell was sunk, reset the AI
          resetPreviousMovesData();
          break;
      }
    }
  };

  return { attack, autoAttack, getType };
};

export default Player;
