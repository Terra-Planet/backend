const { MnemonicKey, LCDClient } = require('@terra-money/terra.js');
require('isomorphic-fetch');


exports.get_lcd_client = (network) => {
    if(network=='main') {
        return new LCDClient({
            URL: 'https://lcd.terra.dev',
            chainID: 'columbus-5',    
        });
    } else {
        return new LCDClient({
            URL: 'https://bombay-lcd.terra.dev',
            chainID: 'bombay-12',    
        });

    }
}

exports.get_gas_prices = async (token) => { 
    //always main net gas prices
    const gasPrices = await (await fetch('https://fcd.terra.dev/v1/txs/gas_prices')).json();
    return {
        [token]: gasPrices[token]
    };
}

exports.get_wallet = (mnemonic,network) => {
    const terra = module.exports.get_lcd_client(network);

    const mk = new MnemonicKey({mnemonic:mnemonic});
    return terra.wallet(mk);
}

exports.address_is_valid = (address) => {
    return address.length === 44 && new RegExp(`^terra([0-9a-zA-Z]){39}`).test(address);
}