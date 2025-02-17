/* eslint-disable quotes */
/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
const HTTPProviderRateLimitRetry = require('./lib/http-provider-rate-limit-retry');

require('babel-register');
require('babel-polyfill');
require('dotenv').config();

module.exports = {

  plugins: ["truffle-security"],

    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */

    networks: {
        dev: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        kaleido: {
            provider: () => {
                const appCred = process.env.KALEIDO_APP_CREDENTIALS; // from application credential widget
                const connectionURL = process.env.KALEIDO_CONNECTION_URL; // without protocol (https://)
                return new HTTPProviderRateLimitRetry(`https://${appCred}@${connectionURL}`, 100000);
            },
            network_id: "*", // Match any network id
            gasPrice: 0,
            gas: 4500000
            /* Type: 'quorum' // Use this property for Quorum environments */
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
            gas: 0xfffffffffff, // <-- Use this high gas value
            gasPrice: 0x01      // <-- Use this low gas price
        }
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
    // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
        // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
        // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            settings: {
                // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                }
                //  evmVersion: "byzantium"
            }
        }
    }

};
