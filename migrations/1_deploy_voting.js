// Import du smart contract "Voting"
const Voting = artifacts.require("Voting");

module.exports = async (deployer) => {
    // Deployer le smart contract!
    await deployer.deploy(Voting);
    const instance = await Voting.deployed();
    //const value = await instance.get();
    //console.log(value);
    //await instance.set(2);
    //const value2 = await instance.get();
    //console.log(value2)
} 