const externalAddrs = {
    // https://data.chain.link/eth-usd
    CHAINLINK_ETHUSD_PROXY: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    // https://docs.tellor.io/tellor/integration/reference-page
    TELLOR_MASTER: "0x20374E579832859f180536A69093A126Db1c8aE9",
    // https://uniswap.org/docs/v2/smart-contracts/factory/
    UNISWAP_V2_FACTORY: "0x219d61902906f66a4EdB61545218374A584bbEB2",
    UNISWAP_V2_ROUTER02: "0xd03d102C9dfCE013eA4671B5c282D65Cf1eB1DC5",
    WETH_ERC20: "0xaE85Bf723A9e74d6c663dd226996AC1b8d075AA9",
}

const liquityAddrsTest = {
    GENERAL_SAFE: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10", // Hardhat dev address
    LQTY_SAFE: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10", //  Hardhat dev address
    // LQTY_SAFE:"0x66aB6D9362d4F35596279692F0251Db635165871",
    DEPLOYER: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10" // Mainnet test deployment address
}

const liquityAddrs = {
    GENERAL_SAFE: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10", // TODO
    LQTY_SAFE: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10", // TODO
    DEPLOYER: "0xCCE4614aDB19bc9e2296D5767Cad47d7b70BBd10",
}

const beneficiaries = {
    TEST_INVESTOR_A: "0xdad05aa3bd5a4904eb2a9482757be5da8d554b3d",
    TEST_INVESTOR_B: "0x625b473f33b37058bf8b9d4c3d3f9ab5b896996a",
    TEST_INVESTOR_C: "0x9ea530178b9660d0fae34a41a02ec949e209142e",
    TEST_INVESTOR_D: "0xffbb4f4b113b05597298b9d8a7d79e6629e726e8",
    TEST_INVESTOR_E: "0x89ff871dbcd0a456fe92db98d190c38bc10d1cc1"
}

const OUTPUT_FILE = './mainnetDeployment/telos_testnetDeploymentOutput.json'

const delay = ms => new Promise(res => setTimeout(res, ms));
const waitFunction = async() => {
    return delay(90000) // wait 90s
}

const GAS_PRICE = 1000000000 // 1 Gwei
const TX_CONFIRMATIONS = 1

const ETHERSCAN_BASE_URL = 'https://rinkeby.etherscan.io/address'

module.exports = {
    externalAddrs,
    liquityAddrs,
    beneficiaries,
    OUTPUT_FILE,
    waitFunction,
    GAS_PRICE,
    TX_CONFIRMATIONS,
    ETHERSCAN_BASE_URL,
};