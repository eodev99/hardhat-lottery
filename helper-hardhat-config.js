const { ethers } = require("hardhat");

const networkConfig = {
    4: {
        name: "rinkeby",
        vrfCoordinatorV2Address: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        entranceFee: ethers.utils.parseEther("0.01"),
        subscriptionId: "7699",
        callbackGasLimit: "500000",
        interval: "60",
    },
    31337: {
        name: "hardhat",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        entranceFee: ethers.utils.parseEther("0.01"),
        callbackGasLimit: "500000",
        interval: "60",
    },
};

const devChains = ["hardhat", "localhost"];

module.exports = { networkConfig, devChains };
