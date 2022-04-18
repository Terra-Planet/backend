const express = require('express')
const wallet_router = require('./routes/wallet')
const anchor_router = require('./routes/anchor')
const server_router = require('./routes/server')
const market_router = require('./routes/market')

const app = express()

app.use(express.json());

app.use('/wallet', wallet_router);
app.use('/anchor', anchor_router);
app.use('/server', server_router);
app.use('/market', market_router);

module.exports = app;
