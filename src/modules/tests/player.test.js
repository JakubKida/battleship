import Gameboard from '../factories/gameboard';
import Ship from '../factories/ship';
import Player from '../factories/player';
import { SHIP_TYPES } from '../helpers/helpers';

describe('Player Factory', () => {
  describe('attacking enemy gameboard', () => {
    test('check if enemy receives the attack', () => {
      let gameboard = new Gameboard();
      let player = new Player();
      let ship = new Ship('submarine');
      gameboard.placeShip(ship, 0, 0);
      expect(player.attack(gameboard, 0, 0)).toBe(true);
      console.table(gameboard.board);
    });

    test('check if enemy receives the auto attack', () => {
      let gameboard = new Gameboard();
      let player = new Player();
      let ship = new Ship('submarine');
      gameboard.placeShip(ship, 0, 0);
      expect(player.autoAttack(gameboard)).toBe(true);
      console.table(gameboard.board);
    });
  });
});
