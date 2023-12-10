// //access SHA 256 function
// //const SHA256 = require('crypto-js/sha256');
// const ChainUtil = require('../chain-util');
// //require diffficulty from config file
// const { DIFFICULTY, MINE_RATE } = require('../config');
// //create  ES6 JS class
// class Block {
//     //create constrauctor for unique attributes
//     constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
//         this.timestamp = timestamp;
//         this.lastHash = lastHash;
//         this.hash = hash;
//         this.data = data;
//         this.nonce = nonce;  
//         this.difficulty = difficulty || DIFFICULTY;
//     }
//     //add toString()  function for debagging
//     toString() {
//         return ` Block - 
//         Timestamp:  ${this.timestamp}
//         Last Hash:  ${this.lastHash.substring(0, 10)}
//         Hash:       ${this.hash.substring(0,  10)}
//         Nonce:      ${this.nonce}
//         Difficulty: ${this.difficulty}
//         Data:       ${this.data}`;
//     }

//     //use static func to  don't make new instances of Block class  ex. of call Block.genesis()
//     //create the first block of the chain Genesis// 0 is default nonce value
//     static genesis() {
//         return  new this('genesis time', '-------', 'f1r57-h45h', [], 0, DIFFICULTY);
//     }
//     //create new blocks based on the genesis
//     static mineBlock(lastBlock, data) {
//         let hash, timestamp;
//         const lastHash = lastBlock.hash;
//         //get the difficulty based on the last block
//         let { difficulty } = lastBlock;
//         //start a nonce val of 0
//         let nonce = 0;
//          //create a new hash value based on nonce value with do while looop
//          do {
//             nonce++;
//             timestamp = Date.now();
//             difficulty = Block.adjustDifficulty(lastBlock, timestamp);
//             hash = Block.hash(timestamp,  lastHash, data, nonce, difficulty);
//             //check difficulty //PoW in action
//          } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        
       
//         //get new block values 
//         return new this(timestamp, lastHash, hash, data, nonce, difficulty);

//     }
//     //create func that reproduces the sha256 hash
//     static hash(timestamp, lastHash, data, nonce, diffficulty) {
//         return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}`).toString();
//     }

//     //create a func to check the hash of every block
//     static blockHash(block) {
//         const {timestamp, hash, data, nonce, difficulty} = block;
//         return Block.hash(timestamp, hash, data, nonce, difficulty);
//     }
//     //create a func to ca;lcultate difficulty
//     static adjustDifficulty(lastBlock, curretTime) {
//         let { difficulty } = lastBlock;
//         //if difficulty is more then 3000 (MINE_RATE) increase 1 else decrease 1
//         difficulty = lastBlock.timestamp + MINE_RATE > curretTime ? difficulty + 1 : difficulty -1;
//         return difficulty;
//     }
// }
// //export the module to make the class sharable with other files
// module.exports = Block;

//calculate difficulty based on previous block timestamp ansd current

const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ?
      difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;