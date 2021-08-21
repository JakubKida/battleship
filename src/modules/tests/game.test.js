import Game from '../factories/game';

describe('Game Factory', () => {
  test('creating players', () => {
    const game = new Game('pc');
    expect(game.playerOne.getType()).toBe('human');
    expect(game.playerTwo.getType()).toBe('pc');
  });
});
