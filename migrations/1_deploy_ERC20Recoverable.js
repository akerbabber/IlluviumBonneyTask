const ERC20Recoverable = artifacts.require("ERC20Recoverable");

module.exports = function(deployer) {
    // deployment steps
    deployer.deploy(ERC20Recoverable,"MyToken","MTK");
  };