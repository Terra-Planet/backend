const { MnemonicKey, MsgSwap, Coin, MsgSend, isTxError } = require('@terra-money/terra.js');
const { validateMnemonic } = require ('bip39')
const utils = require('../lib/utils');

const express = require('express');
const router = express.Router();


router.get('/create/:network?', function(req, res) {
    const mk = new MnemonicKey();
    const terra = utils.get_lcd_client(req.params.network);
    const wallet = terra.wallet(mk);

    res.send({
        'acc_address':wallet.key.accAddress,
        'mnemonic':mk.mnemonic
    });
}); 

router.post('/restore', function(req, res) {
    
    if(!validateMnemonic(req.body.mnemonic)) {
        res.status(400).send({status:'invalid_mnemonic'});
    } else {
        const wallet = utils.get_wallet(req.body.mnemonic);

        res.send({
            'acc_address':wallet.key.accAddress        
        });
    }
}); 


router.get('/balance/:acc_address/:network?', async (req, res) =>{

    const terra = utils.get_lcd_client(req.params.network);

    if (utils.address_is_valid(req.params.acc_address)) {
        terra.bank.balance(req.params.acc_address).then( (balance) => { 
            res.send({native:balance});
        }).catch ( (err) => {
            res.status(400).send({status:'err',msg:err.message});
        });    
    } else {
        res.status(400).send({status:'err',msg:'invalid address'});
    }
}); 


router.post('/swap', async (req, res) =>{    

    const terra = utils.get_lcd_client(req.body.network);
    const wallet = utils.get_wallet(req.body.mnemonic, req.body.network);
    
    const swap = new MsgSwap(
        wallet.key.accAddress,
        new Coin(req.body.src, req.body.amount * 10 ** 6 ),
        req.body.dst
    );

    utils.get_gas_prices(req.body.fee_token).then ( (gas_prices) => {
        
        const payload = { msgs: [swap], gasPrices:gas_prices }
        if (req.body.memo) {
            payload.memo = req.body.memo;
        }

        wallet.createAndSignTx(payload).then ( async (tx) => {
            terra.tx.broadcastSync(tx).then(async result => {        
                if (isTxError(result)) {
                    res.status(400).send({
                        status: 'err',
                        result: result
                    });
                    return;
                }
        
                for (i=0;i<1023;i++) {        
                    const data = await terra.tx.txInfo(result.txhash).catch(() => {})                
                    if (data) {
                        res.send(data);
                        break;
                    }        
                    await new Promise(resolve => setTimeout(resolve, 250))
                }
            }).catch( (err)=> {
                res.status(400).send({status:'broadcast_err',msg:err.message});
            });
        }).catch( (err)=> {
            res.status(400).send({status:'create_and_sign_err',msg:err.message});
        });    
    }).catch( (err)=> {
        res.status(400).send({status:'get_gas_prices',msg:err.message});
    });    
});


router.post('/swap/preview', async (req, res) =>{        

    const terra = utils.get_lcd_client(req.body.network);
    const wallet = utils.get_wallet(req.body.mnemonic, req.body.network);
    
    const swap = new MsgSwap(
        wallet.key.accAddress,
        new Coin(req.body.src, req.body.amount * 10 ** 6 ),
        req.body.dst
    );
    
    utils.get_gas_prices(req.body.fee_token).then ( (gas_prices) => {
        wallet.createTx({ msgs: [swap], gasPrices: gas_prices}).then ( (tx) => {    
            res.send(tx);        
        }).catch( (err)=> {
            res.status(400).send({status:'create_and_sign_err',msg:err.message});
        });    
    }).catch( (err)=> {
        res.status(400).send({status:'get_gas_prices',msg:err.message});
    });    
    
});


router.post('/send/preview', async (req, res) =>{       

    const wallet = utils.get_wallet(req.body.mnemonic, req.body.network);

    const send = new MsgSend(
        wallet.key.accAddress,
        req.body.dst_addr,
        { [req.body.token]: req.body.amount * 10 ** 6 }
    );
    
    utils.get_gas_prices(req.body.fee_token).then ( (gas_prices) => {
        wallet.createTx({ msgs: [send], gasPrices: gas_prices  }).then ( (tx) => {
            res.send(tx);
        }).catch ( (err) => {
            res.status(400).send({status:'err',msg:err.message})
        });
    }).catch( (err)=> {
        res.status(400).send({status:'get_gas_prices',msg:err.message});
    });    
});


router.post('/send', async (req, res) =>{       
    
    const terra = utils.get_lcd_client(req.body.network);
    const wallet = utils.get_wallet(req.body.mnemonic, req.body.network);
    
    const send = new MsgSend(
        wallet.key.accAddress,
        req.body.dst_addr,
        { [req.body.token]: req.body.amount * 10 ** 6 }
    );
    
    utils.get_gas_prices(req.body.fee_token).then ( (gas_prices) => {
        const payload = { msgs: [send], gasPrices: gas_prices }
        if (req.body.memo) {
            payload.memo = req.body.memo;
        }
        
        wallet.createAndSignTx(payload).then ( (tx) => {
            terra.tx.broadcastSync(tx).then(async result => {        
                if (isTxError(result)) {
                    res.status(400).send({
                        status: 'err',
                        result: result
                    });
                    return;
                }
        
                for (i=0;i<1023;i++) {        
                    const data = await terra.tx.txInfo(result.txhash).catch(() => {})                            
                    if (data) {
                        res.send(data);
                        break;
                    }        
                    await new Promise(resolve => setTimeout(resolve, 250))
                }
            }).catch( (err)=> {
                res.status(400).send({status:'broadcast_err',msg:err.message});
            });
        }).catch( (err)=> {
            res.status(400).send({status:'create_and_sign_err',msg:err.message});
        });    
    }).catch( (err)=> {
        res.status(400).send({status:'get_gas_prices',msg:err.message});
    });    
});


router.get('/validate_addr/:acc_address', async (req, res) =>{       
    if (utils.address_is_valid(req.params.acc_address)) {
        res.send({'valid':true});
    } else {
        res.send({'valid':false});
    }
    
});


module.exports = router;