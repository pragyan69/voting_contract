
// SPDX-License-Identifier: MIT
// This comment defines the license for the smart contract as MIT and is a standard way to include licensing.

pragma solidity ^0.8.0;
// Specifies the compiler version that the smart contract is compatible with. Here, it is 0.8.x.

contract Voting {
    // This is the main contract named "Voting".

    address public owner;
    // Public state variable to store the address of the contract owner.

    struct Candidate {
        // A structure to represent a Candidate.
        uint256 id;
        // Unique identifier for each candidate.
        string name;
        // The name of the candidate.
        uint256 voteCount;
        // The total number of votes received by the candidate.
    }

    mapping(address => bool) public voters;
    // A mapping to keep track of addresses that have already voted.

    mapping(uint256 => Candidate) public candidates;
    // A mapping that associates a Candidate struct with a unique identifier.

    uint256 public candidatesCount;
    // A variable to keep track of the total number of candidates.

    constructor() {
        // Constructor function that initializes the contract.
        owner = msg.sender;
        // Set the contract owner to the address that deploys the contract.
    }

    modifier onlyOwner() {
        // A modifier to restrict certain functions to the owner only.
        require(msg.sender == owner, "Only owner can perform this action");
        // Checks if the message sender is the owner; if not, revert the transaction.
        _;
        // Continue execution if the sender is the owner.
    }

    function addCandidate(string memory _name) public onlyOwner {
        // Function to add a new candidate.
        candidatesCount++;
        // Increment the count of total candidates.
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        // Add a new candidate with the next available id, provided name, and zero vote count.
    }

    function removeCandidate(uint256 _id) public onlyOwner {
        // Function to remove an existing candidate.
        delete candidates[_id];
        // Remove the candidate by setting their struct to the default zero state.
    }

    function vote(uint256 _candidateId) public {
        // Function to cast a vote for a candidate.
        require(!voters[msg.sender], "You have already voted.");
        // Check that the sender hasn't voted before.
        require(candidates[_candidateId].id != 0, "Candidate does not exist.");
        // Check that the candidate exists.
        
        voters[msg.sender] = true;
        // Mark this address as having voted.
        candidates[_candidateId].voteCount++;
        // Increment the vote count for the selected candidate.
    }

    function totalVotes(uint256 _candidateId) public view returns (uint256) {
        // Function to get the total number of votes for a candidate.
        return candidates[_candidateId].voteCount;
        // Return the vote count for the specified candidate.
    }
}
