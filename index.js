// module.exports  = Blockchain;
const Block = require('./block');

class Blockchain {
    //create a chain
  constructor() {
    this.chain = [Block.genesis()];
  }
  //create a func to add blocks to the chain
  addBlock(data) {
    //generate a new block //get the last block on the chain
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    //add the last block to the chain array
    this.chain.push(block);

    return block;
  }
  //create func to check the chain is valid
  isValidChain(chain) {
    //check the incoming chain has the right genesis block the first  block of the chain
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    //run a validation for each  block after the genesis
    for (let i=1; i<chain.length; i++) {
      const block = chain[i]; //show current block
      const lastBlock = chain[i-1]; //last block
        //check if the block hash matches 
      if (block.lastHash !== lastBlock.hash ||
          block.hash !== Block.blockHash(block)) {
        return false;
      }
    }
    //run if  everything is ok
    return true;
  }
  //create a func to replace the chain
  replaceChain(newChain) {
    //check the new chain is longer then the current one
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than the current chain.');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('The received chain is not valid.');
      return;
    }
    //if pass the if statements  means the chain is valid
    console.log('Replacing blockchain with the new chain.');
    this.chain = newChain;
  }
}

module.exports = Blockchain;