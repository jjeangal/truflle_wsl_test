// Deployed at 0x7FfF2E820aE70A43b4175D037CB0a7fB44706543

const HDWalletProvider = require('@truffle/hdwallet-provider'); 
require('dotenv').config();

const ROPSTEN_URL = process.env.INFURA_ID;
const PRIVATE_KEY = process.env.MNEMONIC;

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },

    ropsten: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, ROPSTEN_URL),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      //confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 600,  // # of blocks before a deployment times out  (minimum/default: 50)
      //skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  },

  plugins: ['solidity-coverage'],


  // Set default mocha options here, use special reporters, etc.
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
     gasPrice: 1,
     token: 'ETH',
     showTimeSpent: true, 
    }
  },


  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.15",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
      //  evmVersion: "byzantium"
      }
    }
  },
};
