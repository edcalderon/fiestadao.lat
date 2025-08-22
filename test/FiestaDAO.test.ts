import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

declare module "ethers" {
  interface ContractFactory {
    deploy(...args: any[]): Promise<any>;
  }
}

declare module "mocha" {
  interface Context {
    timeout: number;
  }
}

describe("FiestaDAO", function () {
  let FiestaDAO: any;
  let fiestaDAO: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  const MIN_STAKE_TO_CREATE_PROPOSAL = ethers.utils.parseEther("10");
  const MIN_STAKE_TO_VOTE = ethers.utils.parseEther("1");
  const VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners() as Signer[];
    
    // Deploy the contract
    FiestaDAO = await ethers.getContractFactory("FiestaDAO");
    fiestaDAO = await FiestaDAO.deploy();
    await fiestaDAO.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fiestaDAO.owner()).to.equal(await owner.getAddress());
    });

    it("Should have the correct constants", async function () {
      expect(await fiestaDAO.MIN_STAKE_TO_CREATE_PROPOSAL()).to.equal(MIN_STAKE_TO_CREATE_PROPOSAL);
      expect(await fiestaDAO.MIN_STAKE_TO_VOTE()).to.equal(MIN_STAKE_TO_VOTE);
      expect(await fiestaDAO.VOTING_DURATION()).to.equal(VOTING_DURATION);
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("5");
      
      // Send ETH to the contract (simulating staking)
      await expect(
        addr1.sendTransaction({
          to: fiestaDAO.address,
          value: stakeAmount
        })
      ).to.changeEtherBalance(addr1, -stakeAmount);

      // Check if staked amount is recorded
      expect(await fiestaDAO.stakedTokens(addr1.address)).to.equal(stakeAmount);
    });
  });

  describe("Project Creation", function () {
    const projectTitle = "Test Project";
    const projectDescription = "This is a test project";
    const category = "Development";
    const requestedAmount = ethers.utils.parseEther("100");

    beforeEach(async function () {
      // Stake enough to create a proposal
      await addr1.sendTransaction({
        to: fiestaDAO.address,
        value: MIN_STAKE_TO_CREATE_PROPOSAL
      });
    });

    it("Should allow creating a new project", async function () {
      await expect(
        fiestaDAO.connect(addr1).createProject(
          projectTitle,
          projectDescription,
          category,
          requestedAmount
        )
      ).to.emit(fiestaDAO, "ProjectCreated");

      // Check if project was created
      const project = await fiestaDAO.projects(0);
      expect(project.title).to.equal(projectTitle);
      expect(project.description).to.equal(projectDescription);
      expect(project.category).to.equal(category);
      expect(project.requestedAmount).to.equal(requestedAmount);
      expect(project.creator).to.equal(addr1.address);
    });
  });
});
