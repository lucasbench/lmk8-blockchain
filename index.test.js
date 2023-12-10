//access the blockchain class
const  Blockchain = require('./index');
//require block module to access the genesis block
const Block = require('./block');

describe('Blockchain', () => {
    let  bc, bc2;

    beforeEach(() => {
        //refresh the blockchain instance to a new one  before eacj=h test
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('start with genesis block', () => {
        //test the first element within the chain
        expect(bc.chain[0]).toEqual(Block.genesis());
    });
    //test the addBlock func
    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);   
    });

    it('validates a valid chain', () => {
        //validate the chain using the first block instance and passing the next
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad data';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a currupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain  with  a new chain', () => {
        bc2.addBlock('goo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replace  the chain with one of less then or equal to length', () => {
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    })
});