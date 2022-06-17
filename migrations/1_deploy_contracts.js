// Import du smart contract "SimpleStorage"
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async (deployer) => {
    // Deployer le smart contract!
    await deployer.deploy(SimpleStorage, 1, {value: 3});
    //const instance = await SimpleStorage.deployed();
    //const value = await instance.get();
    //console.log(value);
    //await instance.set(2);
    //const value2 = await instance.get();
    //console.log(value2)
} 