const ERC20Recoverable = artifacts.require("ERC20Recoverable");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time, // Manages time
  ether, // converts from ether to wei unit of measure (multiplies by 10 ** 18)
} = require("@openzeppelin/test-helpers");
const chai = require("chai");
const expect = require("chai").expect;
const signUtil = require("@metamask/eth-sig-util");

chai.use(require("chai-bn")(BN));
const { ZERO_ADDRESS } = constants;

contract("ERC20", (accounts) => {
  const [owner, user1, user2, backup1, backup2] = accounts;
  const user1pk =
    "ba1730aa55d9c78c8dca105eb3bc1b50ca7fd85daeea743db62de3009de79576";
  let recoverableToken;
  let signature;
  describe("Contract deployment", async () => {
    it("should deploy the ERC20Recoverable contract", async () => {
      expect((recoverableToken = await ERC20Recoverable.new("MyToken", "MTK")));
    });
    it("the provided private key must match user1 address", async () => {
      const user1Address = await web3.eth.accounts.privateKeyToAccount(user1pk);
      expect(user1Address.address).to.equal(user1);
    });
  });

  describe("Basic ERC20 functionalities", () => {
    // Test token minting
    it("should mint tokens to a specified address", async () => {
      expect(
        await recoverableToken.mint(user1, ether("1000"), { from: owner })
      );
    });

    // Test token transfer
    it("should transfer tokens from one account to another", async () => {
      expect(
        await recoverableToken.transfer(user2, ether("500"), { from: user1 })
      );
    });

    // Test token allowance and approval
    it("should approve and check allowance of tokens", async () => {
      expect(
        await recoverableToken.approve(user2, ether("100"), { from: user1 })
      );
      expect(
        await recoverableToken.allowance(user1, user2)
      ).to.be.bignumber.equal(ether("100"));
    });

    // Test increasing/decreasing allowance
    it("should increase and decrease allowance of tokens", async () => {
      expect(
        await recoverableToken.increaseAllowance(user2, ether("100"), {
          from: user1,
        })
      );
      expect(
        await recoverableToken.allowance(user1, user2)
      ).to.be.bignumber.equal(ether("200"));
      expect(
        await recoverableToken.decreaseAllowance(user2, ether("100"), {
          from: user1,
        })
      );
      expect(
        await recoverableToken.allowance(user1, user2)
      ).to.be.bignumber.equal(ether("100"));
    });
  });

  describe("Backup address functionality", () => {
    // Test setting a backup address
    it("should set a backup address for a user", async () => {
      expect(await recoverableToken.setBackupAddress(backup1, { from: user1 }));
      expect(await recoverableToken.setBackupAddress(backup2, { from: user2 }));
    });

    // Test getting the backup address of an account
    it("should return the backup address of a user", async () => {
      expect(await recoverableToken.getBackupAddressOf(user1)).to.equal(
        backup1
      );
      expect(await recoverableToken.getBackupAddressOf(user2)).to.equal(
        backup2
      );
    });

    // Test removing a backup address
    it("should remove the backup address of a user", async () => {
      expect(await recoverableToken.removeBackupAddress({ from: user2 }));
      expect(await recoverableToken.getBackupAddressOf(user2)).to.equal(
        ZERO_ADDRESS
      );
    });
  });

  describe("Emergency token recovery", () => {
    // Test the EIP712 signature generation
    it("should generate a valid EIP712 signature", async () => {
      // Get the recovery hash
      const msgParams = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          EmergencyTokenRecovery: [{ name: "account", type: "address" }],
        },
        primaryType: "EmergencyTokenRecovery",
        domain: {
          name: await recoverableToken.name(),
          version: "V4",
          chainId: await web3.eth.getChainId(),
          verifyingContract: recoverableToken.address,
        },
        message: {
          account: user1,
        },
      };
      // Sign the hash
      signature = await signUtil.signTypedData({
        data: msgParams,
        version: "V4",
        privateKey: user1pk,
      });
      const recoveredAddress = web3.utils.toChecksumAddress(
        await signUtil.recoverTypedSignature({
          data: msgParams,
          signature: signature,
          version: "V4",
        })
      );
      expect(recoveredAddress).to.equal(user1);

      console.log("signature", signature);
      // Call emergencyTokenRecovery() with the generated signature
      console.log("backup", await recoverableToken.getBackupAddressOf(user1));
      console.log("user", user1);
    });

    // Test the emergency token recovery process
    it("should recover tokens in an emergency", async () => {
      const userBalance = await recoverableToken.balanceOf(user1);
      const backupBalance = await recoverableToken.balanceOf(backup1);
      const recoveryTx = await recoverableToken.emergencyTokenRecovery(
        signature,
        user1,
        { from: backup1 }
      );
      expect(recoveryTx);
      expect(await recoverableToken.balanceOf(user1)).to.be.bignumber.equal("");
      expect(await recoverableToken.balanceOf(backup1)).to.be.bignumber.equal(
        userBalance.add(backupBalance)
      );
    });

    // Test blacklisting of an address after emergency token recovery
    it("should blacklist an address after emergency token recovery", async () => {
      expect(await recoverableToken.isBlackListed(user1)).to.be.true;
    });
  });

  describe("Blacklisted address behavior", () => {
    // Test that transferring tokens to a blacklisted address fails (or transfers to the backup address if you implement the optional functionality)
    it("should transfer the tokens directly to the backup address", async () => {
      const backupBalance = await recoverableToken.balanceOf(backup1);
      const transaction = await recoverableToken.transfer(user1, ether("1"), { from: backup1 });
      expect(transaction);
      expect(await recoverableToken.balanceOf(user1)).to.be.bignumber.equal("0");
      expect(await recoverableToken.balanceOf(backup1)).to.be.bignumber.equal(backupBalance);
    });
  });
});
