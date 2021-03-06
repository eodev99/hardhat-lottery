const { network, ethers } = require("hardhat");
const { devChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25"); //0.25 LINK premium
const GAS_PRICE_LINK = "1000000000"; //calculated value based on gas price of the chain (link per gas)
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_LINK];

    if (devChains.includes(network.name)) {
        log("Local network detected, deploying mocks.");
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            args: args,
        });
        log("Mocks deployed!");
        log("--------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
