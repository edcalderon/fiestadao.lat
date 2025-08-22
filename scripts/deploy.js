const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const SampleContract = await hre.ethers.getContractFactory("SampleContract");
  const sampleContract = await SampleContract.deploy("Hello from FiestaDAO!");

  await sampleContract.deployed();

  console.log("SampleContract deployed to:", sampleContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
