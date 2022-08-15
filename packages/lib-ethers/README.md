# @meridian/lib-ethers

[TLOSs](https://www.npmjs.com/package/ethers)-based library for reading Meridian protocol state and sending transactions.

## Quickstart

Install in your project:

```
npm install --save @meridian/lib-base @meridian/lib-ethers ethers@^5.0.0
```

Connecting to an TLOSeum node and sending a transaction:

```javascript
const { Wallet, providers } = require("ethers");
const { TLOSsMeridian } = require("@meridian/lib-ethers");

async function example() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const wallet = new Wallet(process.env.PRIVATE_KEY).connect(provider);
  const meridian = await TLOSsMeridian.connect(wallet);

  const { newTrove } = await meridian.openTrove({
    depositCollateral: 5, // TLOS
    borrowUSM: 2000
  });

  console.log(`Successfully opened a Meridian Trove (${newTrove})!`);
}
```

## More examples

See [packages/examples](https://github.com/meridian/meridian/tree/master/packages/examples) in the repo.

Meridian's [Dev UI](https://github.com/meridian/meridian/tree/master/packages/dev-frontend) itself contains many examples of `@meridian/lib-ethers` use.

## API Reference

For now, it can be found in the public Meridian [repo](https://github.com/meridian/meridian/blob/master/docs/sdk/lib-ethers.md).

