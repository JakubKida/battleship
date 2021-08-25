export const SHIP_TYPES = [
  'carrier',
  'battleship',
  'cruiser',
  'submarine',
  'destroyer',
];

export const SHIP_LENGTHS = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

export const SURROUND_CHECKS = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
];

export const randXY = () => {
  return [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)];
};
