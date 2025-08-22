const { ethers } = require('hardhat');

async function main() {
  console.log("Deploying FiestaDAO contract...");
  
  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  try {
    // Get the contract factory
    const FiestaDAO = await ethers.getContractFactory("FiestaDAO");
    
    // Deploy the contracts
    console.log("Deploying FiestaDAO...");
    const fiestaDAO = await FiestaDAO.deploy();
    await fiestaDAO.waitForDeployment();
    
    const contractAddress = await fiestaDAO.getAddress();
    console.log(`FiestaDAO deployed to: ${contractAddress}`);
    
    // Save the contract address to .env file
    const envPath = '.env';
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the contract address
    if (envContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("Contract address saved to .env file");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
