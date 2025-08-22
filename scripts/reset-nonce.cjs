const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Current account:", deployer.address);
  
  // Get current nonce
  const nonce = await ethers.provider.getTransactionCount(deployer.address, 'latest');
  const pendingNonce = await ethers.provider.getTransactionCount(deployer.address, 'pending');
  
  console.log("Current nonce:", nonce);
  console.log("Pending nonce:", pendingNonce);
  
  if (pendingNonce > nonce) {
    console.log("\n⚠️  Pending transactions detected!");
    console.log("To resolve this, you can:");
    console.log("1. Wait for the pending transactions to be mined");
    console.log("2. Reset your wallet's nonce by sending a new transaction");
    console.log("3. Use a different wallet for deployment");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
