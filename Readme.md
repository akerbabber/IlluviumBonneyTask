# ERC20 Recoverable Token

The ERC20 Recoverable Token is a Solidity smart contract that extends the standard ERC20 token functionalities. It allows users to set a backup address and provides an emergency token recovery mechanism in case of lost private keys or compromised accounts. The contract also implements a blacklist mechanism to prevent transfers to compromised accounts.

## How to run it

Install dependencies `yarn add`

Start ganache: `yarn ganache`

Run tests: `yarn test`

## Run on goerli

Remember to feed the owner address with at least 0.025 goerli ETH

Run tests `yarn goerli-test`

## Run on mumbai

Remember to feed the owner address with at least 0.025 goerli ETH

Run tests `yarn mumbai-test`

## Deployed and verified test contract on mumbai

https://mumbai.polygonscan.com/address/0xed5f9e37d0fe70036070b049490d81b81332690a







