const { assert, expect } = require("chai");
const { network, ethers, getNamedAccounts, deployments } = require("hardhat");
const { devChains, networkConfig } = require("../../helper-hardhat-config");

const RAFFLE_STATE_OPEN = "0";
const RAFFLE_STATE_CALCULATING = "1";

devChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          let raffle, raffleEntranceFee, deployer;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              raffle = await ethers.getContract("Raffle", deployer);
              raffleEntranceFee = await raffle.getEntranceFee();
          });

          describe("fulfillRAndomWords", () => {
              it("works with live chainlink keepers and vrf, get a random winner", async () => {
                  const startingTimestamp = await raffle.getLatestTimestamp();
                  const accounts = await ethers.getSigners();
                  //setup listener before we enter the raffle incase the blockchain moives fast
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winner picked");
                          try {
                              const recentWinner = await raffle.getRecentWinner();
                              const raffleState = await raffle.getRaffleState();
                              const winnerEndingBalance = await accounts[0].getBalance();
                              const endingTimestamp = await raffle.getLatestTimestamp();
                              console.log(`Ending balance is ${winnerEndingBalance}`);
                              await expect(raffle.getPlayer(0)).to.be.reverted;
                              assert.equal(recentWinner.toString(), accounts[0].address);
                              assert.equal(raffleState, RAFFLE_STATE_OPEN);
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              );
                              assert(endingTimestamp > startingTimestamp);
                              resolve();
                          } catch (e) {
                              console.log(e);
                              reject(e);
                          }
                      });
                      console.log("Entering Raffle...");
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
                      const winnerStartingBalance = await accounts[0].getBalance();
                      console.log(`Starting balance is ${winnerStartingBalance}`);
                      console.log("Waiting for raffle");
                  });
              });
          });
      });
