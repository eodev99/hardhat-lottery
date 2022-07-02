const { networkConfig, devChains } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer, player } = await getNamedAccounts();

    const VRF_MOCK_FUND = ethers.utils.parseEther("10");
    const chainId = network.config.chainId;
    log("Deploying Raffle...");
    let vrfCoordinatorV2Address, subscriptionId;
    if (devChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        //Programatically create a subscription
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        //Fund subscription
        //No link needed in mock!
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_MOCK_FUND);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2Address"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }
    const entranceFee = networkConfig[chainId]["entranceFee"];
    const gasLane = networkConfig[chainId]["gasLane"];
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
    const interval = networkConfig[chainId]["interval"];

    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ];
    const raffle = await deploy("Raffle", {
        args,
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("Raffle deployed!");

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(raffle.address, args);
    }
    log("--------------------------------------");
};

module.exports.tags = ["all", "raffle"];
