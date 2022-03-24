const { Coin } = require('@terra-money/terra.js');
const express = require('express');
const router = express.Router();
const utils = require('../lib/utils');

router.get('/rate/:token_in/:token_out', function(req, res) {
    utils.terra.market.swapRate(new Coin(req.params.token_in,1),req.params.token_out).then ( (r)=> {        
        res.send({token:r.denom, amount:r.amount});
    }).catch ( (err) => {
        res.status(400).send({status:'err',msg:err.message});
    });
}); 

module.exports = router;