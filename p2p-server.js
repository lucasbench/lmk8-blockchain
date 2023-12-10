//access the websocket module (ws)
const Websocket = require('ws');
//define port for p2p server
//ex. HTTP_PORT=3002  P2P_PORT = 5003 PEERS = ws://loxcalhost:5001, ws://localhost:5002 npm run dev
const  P2P_PORT = process.env.P2P_PORT || 5001;
//check if peers env var is beeen declared and split it into an array  of peers
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        //see all open sockets
        this.sockets = [];
    }
    //start  the server and create the first socket
    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });

        
        //add event listener for socket servver
        server.on('connection', socket => this.connectSocket(socket));
        
        this.connectToPeers();
        console.log(`listening for p2p connectiion on: ${P2P_PORT}`);
    }

    //create a function that connects all peers to blockchain
    connectToPeers() {
        peers.forEach(peer  => {
            //ws://localhost:5001 (how the peer will look like)
            const socket = new Websocket(peer);
            //make the socket available
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    //push the socket to the array of sockets
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('socket connected');

        this.messageHandler(socket);
        this.sendChain(socket);
        
    }
    //create event listener and message handler
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            
            //replace blockchain with another peer blockchain data (update)
            this.blockchain.replaceChain(data);
        })
    }
    //create helper func bet messageHandler and syncChains
    sendChain(socket) {
        //send the blockchain of the first  instance
        socket.send(JSON.stringify(this.blockchain.chain));
        
    }
    //sync blockchain when new block is mined
    //func to send updated blockchain to all peers
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;