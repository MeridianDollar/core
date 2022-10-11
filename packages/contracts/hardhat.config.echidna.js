require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require("hardhat-gas-reporter");

const accountsList = [{
    privateKey: "6110107ee5376c20acadfe82498b4ba93c9fd44a62156e20cfe4563326fd7388",
    balance: "0xffffffffffffffffffffffff"
}, ]

module.exports = {
    paths: {
        // contracts: "./contracts",
        // artifacts: "./artifacts"
    },
    solc: {
        version: "0.6.11",
        optimizer: {
            enabled: true,
            runs: 100
        }
    },
    networks: {
        buidlerevm: {
            accounts: accountsList,
            gas: 1000000000, // tx gas limit
            blockGasLimit: 1000000000,
            gasPrice: 20000000000,
            allowUnlimitedContractSize: true
        }
    },
    mocha: { timeout: 12000000 },
    rpc: {
        host: "localhost",
        port: 8545
    },
    gasReporter: {
        enabled: (process.env.REPORT_GAS) ? true : false
    }
};