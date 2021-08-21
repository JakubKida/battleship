import { randXY } from '../helpers/helpers';

const Player = (type = 'human') => {
  const attack = (gameboard, x, y) => gameboard.receiveAttack(x, y);
  const getType = () => type;
  const autoAttack = (gameboard) => {
    let [x, y] = randXY();
    while (!gameboard.receiveAttack(x, y)) {
      [x, y] = randXY();
    }
    return true;
  };
  return { attack, autoAttack, getType };
};

export default Player;
