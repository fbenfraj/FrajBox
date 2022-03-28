require("babel-register");
require("babel-polyfill");
require("dotenv").config();

const HDWalletProviderPK = require("truffle-hdwallet-provider-privkey");
const HDWalletProvider = require("truffle-hdwallet-provider");
const privateKeys = process.env.PRIVATE_KEYS || "";
var mnemonic = process.env.RINKEBY_MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProviderPK(
          privateKeys.split(","), // Array of account private keys
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum Node (Ropsten)
        );
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 3,
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`, // Url to an Ethereum Node (Rinkeby)
          1 // Use the address at index 1, which is my learning purpose wallet
        );
      },
      network_id: 4,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
