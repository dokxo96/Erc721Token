 
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "d5a3f0b01d054c928193a0aafa22ad53";
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
if (!mnemonic || mnemonic.split(' ').length !== 12) {
  throw new Error('unable to retrieve mnemonic from .secret');
}

const gasPriceTestnetRaw = fs.readFileSync(".gas-price-testnet.json").toString().trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from .gas-price-testnet.json');
}
console.log("Gas price Testnet: " + gasPriceTestnet);

const path = require("path");


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 4444,
      network_id: "*"
    }, 
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 1,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    //https://public-node.testnet.rsk.co/2.0.1/
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, 'https://public-node.testnet.rsk.co/2.0.1/'),
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * 1.1),
      networkCheckTimeout: 1e9
    },
  },
  contracts_build_directory: path.join(__dirname, "colors/app/src/contracts"),

  compilers: {
    solc: {
      version: "0.5.7",
    }
  }
}