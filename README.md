# terraplanet_backend

To run:

```sh
1. npm install
2. npm start    // runs the app with Basic Auth enabled (user:pass as credentials)
```

## Endpoints

**GET** /market/rate/<token_in>/<token_out>

**GET** /server/status

**GET** /wallet/create/<network?> Optional network parameter, use "main" for production Terra network, if not passed it defaults to testnet.

**GET** /wallet/balance/<wallet_addr>/<network?> see above.

**GET** /wallet/validate_addr/<wallet_addr>

**POST** /wallet/restore

E.g. payload:

```
{   
    "mnemonic":"reject govern sort strategy hunt lunar crunch suspect rain essay maid pill horse main usage term near shock drastic gauge dad belt normal chronic"
}
```

**POST** /wallet/send[/preview]

E.g. payload:

```
{   
    "memo":"this a gift for f0go",
    "fee_token" "uluna",
    "token":"uluna",
    "amount":"1",
    "dst_addr":"terra1y5ryvemxasn5uz7p44nhgdg94r2rmzz5e2k64t",
    "mnemonic":"reject govern sort strategy hunt lunar crunch suspect rain essay maid pill horse main usage term near shock drastic gauge dad belt normal chronic"
}
```


**POST** /wallet/swap[/preview]

E.g. payload:

```
{
    "memo":"swapping in the hood",
    "fee_token": "uusd",
    "mnemonic": "rough simple snap arrest jazz region people combine abuse coyote use camera second parent mimic smile empower daring guess bacon enlist nose anchor spatial",
    "src":"uluna",
    "amount":"1",
    "dst":"uusd"
}
```

**POST** /anchor/deposit

E.g. payload:

```
{
    "mnemonic": "reject govern sort strategy hunt lunar crunch suspect rain essay maid pill horse main usage term near shock drastic gauge dad belt normal chronic",    
    "amount":"150",
    "token":"uusd"
}
```


**POST** /anchor/withdraw

E.g. payload:

```
{
    "mnemonic": "reject govern sort strategy hunt lunar crunch suspect rain essay maid pill horse main usage term near shock drastic gauge dad belt normal chronic",    
    "amount":"150",
    "token":"uusd"
}
```

**POST** /anchor/balance
**POST** /anchor/market

E.g. payload:

```
{
    "mnemonic": "reject govern sort strategy hunt lunar crunch suspect rain essay maid pill horse main usage term near shock drastic gauge dad belt normal chronic"
}
```


