const express = require('express')
const basicAuth = require('express-basic-auth')
const wallet_router = require('./routes/wallet')
const anchor_router = require('./routes/anchor')
const server_router = require('./routes/server')
const market_router = require('./routes/market')

const app = express()

app.use(express.json());
app.use(
    basicAuth({
        authorizer: (username, password) => {
            const httpUser = app.get("httpUser");
            const httpPassword = app.get("httpPassword");

            if (httpUser == undefined || httpPassword == undefined) {
                return true;
            }

            if (httpUser.length == 0 || httpPassword.length == 0) {
                return true;
            }

            const userMatches = basicAuth.safeCompare(username, httpUser);
            const passwordMatches = basicAuth.safeCompare(password, httpPassword);

            return userMatches & passwordMatches
        },
        challenge: true,
        realm: "app"
    })
);

app.get('/health', (req, res) => {
    res.send('UP');
});

app.use('/wallet', wallet_router);
app.use('/anchor', anchor_router);
app.use('/server', server_router);
app.use('/market', market_router);

module.exports = app;
