import Gameboard from '../factories/gameboard';
import Ship from '../factories/ship';
import { SHIP_TYPES } from '../helpers/helpers';

describe('Gameboard Factory', () => {
  describe('properties check', () => {
    const gameboard = new Gameboard();
    test('board array', () => {
      expect(gameboard.board.length).toBe(8);
      expect(gameboard.board[0].length).toBe(8);
    });
  });

  describe('placing ships', () => {
    test('place vertically', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      gameboard.placeShip(ship, 4, 4);
      expect(gameboard.getBoard()[4][4]).toEqual({
        ship,
        index: 0,
      });
      expect(gameboard.getBoard()[4][5]).toEqual({
        ship,
        index: 1,
      });
    });
    test('place vertically', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      ship.flip();
      gameboard.placeShip(ship, 4, 4);
      expect(gameboard.getBoard()[4][4]).toEqual({
        ship,
        index: 0,
      });
      expect(gameboard.getBoard()[5][4]).toEqual({
        ship,
        index: 1,
      });
    });

    test('check for collisions', () => {
      let gameboard = new Gameboard();
      let ship1 = new Ship('submarine');
      let ship2 = new Ship('cruiser');
      gameboard.placeShip(ship1, 4, 5);
      expect(gameboard.placeShip(ship2, 4, 5)).toBe(false);
      expect(gameboard.placeShip(ship2, 5, 5)).toBe(true);
      ship2.flip();
      expect(gameboard.placeShip(ship2, 5, 5)).toBe(false);
      expect(gameboard.placeShip(ship2, 0, 0)).toBe(true);
    });

    test('check for out of bounds', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      expect(gameboard.placeShip(ship, 7, 7)).toBe(false);
      expect(gameboard.placeShip(ship, -1, 7)).toBe(false);
      expect(gameboard.placeShip(ship, 1, 8)).toBe(false);
      ship.flip();
      expect(gameboard.placeShip(ship, 7, 7)).toBe(false);
      expect(gameboard.placeShip(ship, -1, 7)).toBe(false);
      expect(gameboard.placeShip(ship, 1, 8)).toBe(false);
    });

    test('check auto placing', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      let ship2 = new Ship('battleship');
      let ship3 = new Ship('cruiser');

      expect(gameboard.autoPlaceShip(ship)).toBe(true);
      expect(gameboard.autoPlaceShip(ship2)).toBe(true);
      expect(gameboard.autoPlaceShip(ship3)).toBe(true);
    });

    test('check auto placing whole fleet', () => {
      const gameboard = new Gameboard();

      expect(gameboard.areAllShipsPlaced()).toBe(false);
      expect(gameboard.autoPlaceFleet()).toBe(true);
      expect(gameboard.areAllShipsPlaced()).toBe(true);
    });
  });

  describe('receiving attacks', () => {
    let gameboard = new Gameboard();
    let ship = new Ship('submarine');
    gameboard.placeShip(ship, 4, 4);
    expect(gameboard.receiveAttack(4, 4)).toBe(true);
    expect(gameboard.receiveAttack(5, 4)).toBe(true);
    expect(gameboard.receiveAttack(4, 4)).toBe(false);
  });

  describe('check sunking', () => {
    test('check if one ship is sunked', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      gameboard.placeShip(ship, 4, 4);
      expect(ship.isSunk()).toBe(false);
      gameboard.receiveAttack(4, 4);
      expect(ship.isSunk()).toBe(false);
      gameboard.receiveAttack(4, 5);
      gameboard.receiveAttack(4, 6);
      expect(ship.isSunk()).toBe(true);
    });

    test('check if all ships are sunked', () => {
      let gameboard = new Gameboard();
      let ship = new Ship('submarine');
      SHIP_TYPES.forEach((shipType, i) => {
        expect(gameboard.placeShip(new Ship(shipType), i, 0)).toBe(true);
      });
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 1);
      gameboard.receiveAttack(0, 2);
      gameboard.receiveAttack(0, 3);
      gameboard.receiveAttack(0, 4);
      expect(gameboard.areAllShipsSunk()).toBe(false);
      gameboard.receiveAttack(1, 0);
      gameboard.receiveAttack(1, 1);
      gameboard.receiveAttack(1, 2);
      gameboard.receiveAttack(1, 3);
      expect(gameboard.areAllShipsSunk()).toBe(false);
      gameboard.receiveAttack(2, 0);
      gameboard.receiveAttack(2, 1);
      gameboard.receiveAttack(2, 2);
      expect(gameboard.areAllShipsSunk()).toBe(false);
      gameboard.receiveAttack(3, 0);
      gameboard.receiveAttack(3, 1);
      gameboard.receiveAttack(3, 2);
      expect(gameboard.areAllShipsSunk()).toBe(false);
      gameboard.receiveAttack(4, 0);
      gameboard.receiveAttack(4, 1);
      expect(gameboard.areAllShipsSunk()).toBe(true);
    });
  });
});
