
const Block = require('./block');
//run check with describe jest func
describe('Block', () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });
  //check the data match  input
  it('sets the `data` to match the input', () => {
    //run the test
    expect(block.data).toEqual(data);
  });
  //lastHash to match the hash of previous block
  it('sets the `lastHash` to match the hash of the last block', () => {
    //check the hash of the last block
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
  //check the hash matches the difficulty by tits 00000000s
  it('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty))
      .toEqual('0'.repeat(block.difficulty));
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp+360000))
      .toEqual(block.difficulty-1);
  });

  it('raises the difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp+1))
      .toEqual(block.difficulty+1);
  });
});