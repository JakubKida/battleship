import Ship from '../factories/ship';

describe('Ship Factory', () => {
  describe('property checks', () => {
    const ship = new Ship('carrier');
    test('id', () => {
      expect(ship.id).toBe('carrier');
    });
    test('length', () => {
      expect(ship.length).toBe(5);
    });
    test('parts', () => {
      expect(ship.parts).toEqual([null, null, null, null, null]);
    });
    test('orientation', () => {
      expect(ship.orientation).toEqual('horizontal');
    });
  });

  describe('flip method', () => {
    const ship = new Ship('carrier');
    test('flip once', () => {
      expect(ship.getOrientation()).toEqual('horizontal');
      ship.flip();
      expect(ship.getOrientation()).toEqual('vertical');
    });
    test('flip twice', () => {
      ship.flip();
      expect(ship.getOrientation()).toEqual('horizontal');
    });
  });

  describe('hit method', () => {
    const ship = new Ship('submarine');
    test('no hits', () => {
      expect(ship.getParts()).toEqual([null, null, null]);
    });
    test('one hit', () => {
      ship.hit(1);
      expect(ship.getParts()).toEqual([null, 'hit', null]);
    });
  });

  describe('check if sunk', () => {
    const ship = new Ship('submarine');
    test('no parts sunk', () => {
      expect(ship.isSunk()).toEqual(false);
    });
    test('all parts sunk but one', () => {
      ship.hit(0);
      ship.hit(1);
      expect(ship.isSunk()).toEqual(false);
    });
    test('ship is sunked', () => {
      ship.hit(2);
      expect(ship.isSunk()).toEqual(true);
    });
  });
});
