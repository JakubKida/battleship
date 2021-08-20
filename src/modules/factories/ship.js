import { SHIP_LENGTHS } from '../helpers/helpers';

const Ship = (type) => {
  const id = type;
  const length = SHIP_LENGTHS[type];
  const parts = new Array(length).fill(null);
  let orientation = 'horizontal';

  const getParts = () => parts;
  const getOrientation = () => orientation;
  const hit = (position) => {
    parts[position] = 'hit';
  };

  const isSunk = () => {
    if (parts.includes(null)) return false;
    else return true;
  };

  const flip = () => {
    orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
  };

  return {
    getParts,
    getOrientation,
    id,
    length,
    parts,
    orientation,
    hit,
    isSunk,
    flip,
  };
};

export default Ship;
