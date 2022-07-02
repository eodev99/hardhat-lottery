require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const CMC_API_KEY = process.env.CMC_API_KEY || "";
// const KOVAN_RPC_URL =
//     process.env.KOVAN_RPC_URL ||
//     "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const RINKEBY_URL = process.env.RINKEBY_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const RINKEBY_PK =
    process.env.RINKEBY_PK || "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        rinkeby: {
            chainId: 4,
            blockConfirmations: 6,
            url: RINKEBY_URL,
            accounts: [RINKEBY_PK],
        },
    },
    solidity: "0.8.8",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: false,
        noColors: true,
        currency: "USD",
        coinmarketcap: CMC_API_KEY,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    mocha: {
        timeout: 200000,
    },
};
