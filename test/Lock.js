// Importing the "expect" function from the "chai" library for assertions
const { expect } = require("chai");

// Describing a test suite for the "Voting Contract"
describe("Voting Contract", function () {

  // Declare variables that will hold contract instances and signer information
  let Voting;
  let voting;
  let owner;
  let addr1;

  // Code in this block is executed before each test
  beforeEach(async function () {
    // Get the contract factory for the "Voting" contract
    Voting = await ethers.getContractFactory("Voting");
    
    // Get a list of all signers from the Ethereum node
    [owner, addr1] = await ethers.getSigners();
    
    // Deploy the "Voting" contract and get an instance
    voting = await Voting.deploy();
  });

  // Describe a nested test suite for contract deployment
  describe("Deployment", function () {
    // Test if the contract deployment correctly sets the owner
    it("Should set the owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });
  });

  // Describe a nested test suite for managing candidates
  describe("Candidates", function () {
    // Test if the owner can add candidates
    it("Should allow owner to add candidates", async function () {
      await voting.connect(owner).addCandidate("Candidate A");
      await voting.connect(owner).addCandidate("Candidate B");
      expect(await voting.candidatesCount()).to.equal(2);
    });

    // Test if non-owner is restricted from adding candidates
    it("Should not allow non-owner to add candidates", async function () {
      await expect(voting.connect(addr1).addCandidate("Candidate A")).to.be.revertedWith("Only owner can perform this action");
    });

    // Test if the owner can remove candidates
    it("Should allow owner to remove candidates", async function () {
      await voting.connect(owner).addCandidate("Candidate A");
      await voting.connect(owner).removeCandidate(1);
      expect(await voting.candidatesCount()).to.equal(1);
    });
  });

  // Describe a nested test suite for handling voting
  describe("Voting", function () {
    // Code in this block is executed before each test in this suite
    beforeEach(async function () {
      await voting.connect(owner).addCandidate("Candidate A");
      await voting.connect(owner).addCandidate("Candidate B");
    });

    // Test if a user can vote
    it("Should allow a user to vote", async function () {
      await voting.connect(addr1).vote(1);
      expect(await voting.totalVotes(1)).to.equal(1);
    });

    // Test if a user is prevented from voting twice
    it("Should not allow a user to vote twice", async function () {
      await voting.connect(addr1).vote(1);
      await expect(voting.connect(addr1).vote(1)).to.be.revertedWith("You have already voted.");
    });

    // Test if a vote for a non-existent candidate is reverted
    it("Should not allow a vote for a non-existent candidate", async function () {
      await expect(voting.connect(addr1).vote(3)).to.be.revertedWith("Candidate does not exist.");
    });
  });
});
