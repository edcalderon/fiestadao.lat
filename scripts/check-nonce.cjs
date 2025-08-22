const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const nonce = await hre.ethers.provider.getTransactionCount(deployer.address, 'latest');
  const pendingNonce = await hre.ethers.provider.getTransactionCount(deployer.address, 'pending');
  
  console.log(`Current nonce: ${nonce}`);
  console.log(`Pending nonce: ${pendingNonce}`);
  
  if (pendingNonce > nonce) {
    console.log(`\n⚠️  Pending transactions detected!`);
    console.log(`To clear pending transactions, you can either:`);
    console.log(`1. Wait for them to be mined`);
    console.log(`2. Send a new transaction with the same nonce but higher gas price`);
    console.log(`3. Reset your wallet's nonce (advanced)`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
