# Illuvium Solidity Assignment: “Bonnie Situation”
## Context
Bonnie has bought an ERC20 token in 2019 and is hodling it on her Ethereum
account 0x17AC1CEd. Unfortunately her computer was hacked recently and her
account 0x17AC1CEd private key got leaked into the Internet, so today even a pig
has access to it.
Bonnie noticed, however, that despite the fact her ETH got drained away from her
account 0x17AC1CEd, her ERC20 tokens are still there. Unfortunately Bonnie
cannot use these tokens: her 0x17AC1CEd ETH balance is not enough to pay for
the ERC20 transaction, and any ETH she sends to her account gets depleted
immediately, giving Bonnie no chance to transfer her tokens into a safer place.
## Question(s)
What would you recommend to do in this Bonnie situation, is there any way for her
to transfer the tokens into a new safe account?
## Solidity Development Task(s)
Implement a standard ERC20 interface with the following functional additions:

1. Allow token holders to register a backup address which will be used to
transfer tokens to in case of emergency

2. Allow token holders to transfer all their tokens to the previously registered
emergency addresses via an EIP712 signature:

    1) Token holder signs a meaningful message which allows an operation,
    then
    
    2) passes signed message to any other address, which
    
    3) executes an operation by sending a signed message into a smart
    contract

3. Make sure the addresses which successfully performed an emergency
transfer are “blacklisted” – cannot own any tokens anymore: an attempt to
transfer tokens to such an address:

    a. Fails
    
    b. [Optional, bonus] Succeeds, effectively transferring the tokens to the
    address previously used for emergency transfer

## Requirements
1. Use the Truffle framework for Solidity development, make sure your project
structure follows the truffle standard. Use Solidity version 0.8 or higher.
a. You may also use Hardhat + Truffle + Web31
2. Use git as your VCS, submit the link to your git repo for the task verification.
3. Take 0x or OpenZeppelin ERC20 token as a base and modify it to get new 2 3
features.
4. Implement unit tests in ES6. Use ganache-cli or hardhat network to run unit
tests.
5. Provide migration (deployment) script(s).
6. Provide a readme describing your solution, how to install, test, deploy and
use it; put the readme into the root of your repo; use markdown.
7. Use general coding best practices and Solidity best practices in particular.
Make sure your code is well-documented, is easy to read and to follow,
identifier names are meaningful and spelled correctly. Follow the Solidity
coding style.
8. Make implementation simple, but pay attention to details. When time is a
constraint try reducing the scope, but not the quality and depth of the detail of
your solution.
9. Deploy your solution into the goerli network, perform some transactions there
to demonstrate it.
10. Send your final solution and questions along the way to basil@illuvium.io cc
aaron@illuvium.io, cc pedro@illuvium.io
11. Recommended time for the task is 4 hours, maximum – 1 day.
 https://hardhat.org/guides/truffle-testing.html 1
 https://github.com/0xProject/0x-monorepo/ 2
 https://github.com/OpenZeppelin/openzeppelin-contracts 3