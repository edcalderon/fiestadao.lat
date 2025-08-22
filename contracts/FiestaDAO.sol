// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract FiestaDAO is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    uint256 private _proposalIdCounter;
    uint256 private _projectIdCounter;
    
    // Structs
    struct Project {
        uint256 id;
        string title;
        string description;
        string category;
        address beneficiary;
        uint256 requestedAmount;
        uint256 fundedAmount;
        bool isActive;
        bool isCompleted;
        uint256 createdAt;
        address creator;
    }
    
    struct Proposal {
        uint256 id;
        uint256 projectId;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        bool passed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = for, false = against
    }
    
    struct NFTBadge {
        uint256 tokenId;
        uint256 proposalId;
        uint256 projectId;
        string badgeType; // "voter", "creator", "beneficiary"
        bool voteChoice; // true = for, false = against
        uint256 mintedAt;
        string rarity; // "common", "rare", "epic", "legendary"
    }
    
    // State variables
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => NFTBadge) public nftBadges;
    mapping(address => uint256) public stakedTokens;
    mapping(address => uint256) public votingPower;
    mapping(address => uint256[]) public userNFTs;
    
    uint256 public constant VOTING_DURATION = 7 days;
    uint256 public constant MIN_STAKE_TO_CREATE_PROPOSAL = 10 * 10**18; // 10 ASTR
    uint256 public constant MIN_STAKE_TO_VOTE = 1 * 10**18; // 1 ASTR
    
    uint256 public treasuryBalance;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, string title, address creator, uint256 requestedAmount);
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed projectId, string title, address creator);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool choice, uint256 votingPower);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event NFTBadgeMinted(uint256 indexed tokenId, address indexed recipient, uint256 indexed proposalId, string badgeType);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event FundsAllocated(uint256 indexed projectId, uint256 amount);
    
    constructor() ERC721("FiestaDAO Proof of Culture", "FDPOC") Ownable(msg.sender) {}
    
    // Staking functions
    function stakeTokens() external payable {
        require(msg.value > 0, "Must stake some ASTR");
        
        stakedTokens[msg.sender] += msg.value;
        votingPower[msg.sender] += msg.value;
        
        emit TokensStaked(msg.sender, msg.value);
    }
    
    function unstakeTokens(uint256 amount) external nonReentrant {
        require(stakedTokens[msg.sender] >= amount, "Insufficient staked tokens");
        require(amount > 0, "Amount must be greater than 0");
        
        stakedTokens[msg.sender] -= amount;
        votingPower[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    // Project functions
    function createProject(
        string memory _title,
        string memory _description,
        string memory _category,
        address _beneficiary,
        uint256 _requestedAmount
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_requestedAmount > 0, "Requested amount must be greater than 0");
        
        _projectIdCounter++;
        uint256 projectId = _projectIdCounter;
        
        projects[projectId] = Project({
            id: projectId,
            title: _title,
            description: _description,
            category: _category,
            beneficiary: _beneficiary,
            requestedAmount: _requestedAmount,
            fundedAmount: 0,
            isActive: true,
            isCompleted: false,
            createdAt: block.timestamp,
            creator: msg.sender
        });
        
        emit ProjectCreated(projectId, _title, msg.sender, _requestedAmount);
        return projectId;
    }
    
    // Proposal functions
    function createProposal(
        uint256 _projectId,
        string memory _title,
        string memory _description
    ) external returns (uint256) {
        require(votingPower[msg.sender] >= MIN_STAKE_TO_CREATE_PROPOSAL, "Insufficient voting power to create proposal");
        require(projects[_projectId].isActive, "Project is not active");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        _proposalIdCounter++;
        uint256 proposalId = _proposalIdCounter;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.projectId = _projectId;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;
        newProposal.endTime = block.timestamp + VOTING_DURATION;
        newProposal.executed = false;
        newProposal.passed = false;
        
        emit ProposalCreated(proposalId, _projectId, _title, msg.sender);
        return proposalId;
    }
    
    function vote(uint256 _proposalId, bool _choice) external {
        require(votingPower[msg.sender] >= MIN_STAKE_TO_VOTE, "Insufficient voting power");
        require(block.timestamp < proposals[_proposalId].endTime, "Voting period has ended");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted on this proposal");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        
        Proposal storage proposal = proposals[_proposalId];
        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _choice;
        
        uint256 voterPower = votingPower[msg.sender];
        
        if (_choice) {
            proposal.votesFor += voterPower;
        } else {
            proposal.votesAgainst += voterPower;
        }
        
        // Mint NFT badge for voting
        _mintVotingBadge(msg.sender, _proposalId, _choice);
        
        emit VoteCast(_proposalId, msg.sender, _choice, voterPower);
    }
    
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        proposal.executed = true;
        
        // Check if proposal passed (simple majority)
        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.passed = true;
            
            // Allocate funds to project if proposal passed
            Project storage project = projects[proposal.projectId];
            uint256 amountToAllocate = project.requestedAmount;
            
            if (treasuryBalance >= amountToAllocate) {
                project.fundedAmount += amountToAllocate;
                treasuryBalance -= amountToAllocate;
                
                emit FundsAllocated(proposal.projectId, amountToAllocate);
            }
        }
        
        emit ProposalExecuted(_proposalId, proposal.passed);
    }
    
    // NFT Badge functions
    function _mintVotingBadge(address _voter, uint256 _proposalId, bool _voteChoice) internal {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(_voter, tokenId);
        
        // Determine rarity based on voting power
        string memory rarity = _determineRarity(votingPower[_voter]);
        
        nftBadges[tokenId] = NFTBadge({
            tokenId: tokenId,
            proposalId: _proposalId,
            projectId: proposals[_proposalId].projectId,
            badgeType: "voter",
            voteChoice: _voteChoice,
            mintedAt: block.timestamp,
            rarity: rarity
        });
        
        userNFTs[_voter].push(tokenId);
        
        // Set token URI (this would typically point to IPFS metadata)
        string memory tokenURI = _generateTokenURI(tokenId, _proposalId, "voter", rarity);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTBadgeMinted(tokenId, _voter, _proposalId, "voter");
    }
    
    function _determineRarity(uint256 _votingPower) internal pure returns (string memory) {
        if (_votingPower >= 1000 * 10**18) {
            return "legendary";
        } else if (_votingPower >= 500 * 10**18) {
            return "epic";
        } else if (_votingPower >= 100 * 10**18) {
            return "rare";
        } else {
            return "common";
        }
    }
    
    function _generateTokenURI(uint256 _tokenId, uint256 _proposalId, string memory _badgeType, string memory _rarity) internal pure returns (string memory) {
        // This would typically generate a proper JSON metadata URI
        // For now, returning a placeholder
        return string(abi.encodePacked(
            "https://api.fiestadao.lat/metadata/",
            Strings.toString(_tokenId),
            ".json"
        ));
    }
    
    // Treasury functions
    function depositToTreasury() external payable onlyOwner {
        treasuryBalance += msg.value;
    }
    
    function withdrawFromProject(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(msg.sender == project.beneficiary, "Only beneficiary can withdraw");
        require(project.fundedAmount > 0, "No funds to withdraw");
        require(!project.isCompleted, "Project already completed");
        
        uint256 amount = project.fundedAmount;
        project.fundedAmount = 0;
        project.isCompleted = true;
        
        (bool success, ) = payable(project.beneficiary).call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // View functions
    function getProject(uint256 _projectId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory category,
        address beneficiary,
        uint256 requestedAmount,
        uint256 fundedAmount,
        bool isActive,
        bool isCompleted,
        uint256 createdAt,
        address creator
    ) {
        Project storage project = projects[_projectId];
        return (
            project.id,
            project.title,
            project.description,
            project.category,
            project.beneficiary,
            project.requestedAmount,
            project.fundedAmount,
            project.isActive,
            project.isCompleted,
            project.createdAt,
            project.creator
        );
    }
    
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        uint256 projectId,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 endTime,
        bool executed,
        bool passed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.projectId,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.endTime,
            proposal.executed,
            proposal.passed
        );
    }
    
    function getNFTBadge(uint256 _tokenId) external view returns (
        uint256 tokenId,
        uint256 proposalId,
        uint256 projectId,
        string memory badgeType,
        bool voteChoice,
        uint256 mintedAt,
        string memory rarity
    ) {
        NFTBadge storage badge = nftBadges[_tokenId];
        return (
            badge.tokenId,
            badge.proposalId,
            badge.projectId,
            badge.badgeType,
            badge.voteChoice,
            badge.mintedAt,
            badge.rarity
        );
    }
    
    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }
    
    function getUserStakeInfo(address _user) external view returns (uint256 stakedAmount, uint256 userVotingPower) {
        return (stakedTokens[_user], votingPower[_user]);
    }
    
    function getTotalProjects() external view returns (uint256) {
        return _projectIdCounter;
    }
    
    function getTotalProposals() external view returns (uint256) {
        return _proposalIdCounter;
    }
    
    function getTotalNFTs() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }
    
    function getVoteChoice(uint256 _proposalId, address _voter) external view returns (bool) {
        require(proposals[_proposalId].hasVoted[_voter], "User has not voted");
        return proposals[_proposalId].voteChoice[_voter];
    }
}