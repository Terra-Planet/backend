const { MnemonicKey, LCDClient } = require('@terra-money/terra.js');
require('isomorphic-fetch');

const terra = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',    
});


exports.terra = terra;

exports.get_gas_prices = async (token) => { 
    const gasPrices = await (await fetch('https://bombay-fcd.terra.dev/v1/txs/gas_prices')).json();
    return {
        [token]: gasPrices[token]
    };
}

exports.get_wallet = (mnemonic) => {
    const mk = new MnemonicKey({mnemonic:mnemonic});
    return terra.wallet(mk);
}

exports.address_is_valid = (address) => {
    return address.length === 44 && new RegExp(`^terra([0-9a-zA-Z]){39}`).test(address);
}