const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;
  console.log("🚀 Starting final deployment attempt...");
  
  try {
    // Get deployer information
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    
    // Get network information
    const chainId = network.config.chainId;
    console.log("🌐 Network:", network.name, "(Chain ID:", chainId + ")");
    
    // Get account balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      throw new Error("Insufficient balance for deployment");
    }
    
    // Get current gas price
    const feeData = await ethers.provider.getFeeData();
    console.log("⛽ Current gas price:", ethers.formatEther(feeData.gasPrice || 0n), "ETH");
    
    console.log("📦 Getting contract factory...");
    const FiestaDAO = await ethers.getContractFactory("FiestaDAO");
    
    console.log("⚙️  Deploying contract...");
    
    // Deploy with explicit gas settings
    const deploymentTx = await FiestaDAO.getDeployTransaction();
    const estimatedGas = await ethers.provider.estimateGas(deploymentTx);
    console.log("   Estimated gas:", estimatedGas.toString());
    
    const fiestaDAO = await FiestaDAO.deploy({
      gasLimit: estimatedGas,
      gasPrice: feeData.gasPrice,
      nonce: await ethers.provider.getTransactionCount(deployer.address, 'pending')
    });
    
    console.log("⏳ Waiting for deployment (this may take a few minutes)...");
    console.log("   Transaction hash:", fiestaDAO.deploymentTransaction().hash);
    
    await fiestaDAO.waitForDeployment();
    const contractAddress = await fiestaDAO.getAddress();
    
    console.log("\n✅ Deployment successful!");
    console.log("   Contract address:", contractAddress);
    console.log("   Network:", network.name);
    console.log("   Explorer URL: https://shibuya.subscan.io/address/" + contractAddress);
    
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error("   Error:", error.message);
    
    if (error.reason) {
      console.error("   Reason:", error.reason);
    }
    
    if (error.transaction) {
      console.error("   Transaction:", error.transaction);
    }
    
    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Ensure your wallet has sufficient SBY tokens for gas");
    console.log("2. Check if the network is operational at https://shibuya.subscan.io/");
    console.log("3. Try resetting your wallet's nonce with: node scripts/reset-nonce.cjs");
    console.log("4. Try again in a few minutes");
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
