//create an API for the blockchain
//get  the express module
const express = require('express');
//get  the body parser module
const bodyParser  = require('body-parser');
//get  the blockchain module
const Blockchain  = require('../blockchain');
//get the P2p server class
const P2pServer = require('./p2p-server');
//run  server on port 3001 
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer  = new P2pServer(bc);

//allow to use body-parser  with post  requests
app.use(bodyParser.json());
//make an instance of the app
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res)  =>  {
    const block =  bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    //sync all chains 
    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, ()  => console.log(`listening  on  port ${HTTP_PORT}`));
//start the websocket server
p2pServer.listen();