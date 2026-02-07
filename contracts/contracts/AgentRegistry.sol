// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentRegistry is Ownable {
    struct Agent {
        string agentId;
        address wallet;
        string publicKey;
        string metadataURI;
        uint256 totalEarned;
        uint256 streamCount;
        bool registered;
        uint256 registeredAt;
    }

    // Mapping from Agent Token ID (incremental) to Agent
    mapping(uint256 => Agent) public agents;
    // Mapping from Wallet Address to Token ID
    mapping(address => uint256) public walletToAgentId;
    
    uint256 private _nextTokenId;

    event AgentRegistered(uint256 indexed agentTokenId, string agentId, address indexed wallet);
    event AgentMetadataUpdated(uint256 indexed agentTokenId, string newMetadataURI);
    
    constructor() Ownable(msg.sender) {}

    function registerAgent(
        string memory _agentId,
        address _wallet,
        string memory _publicKey,
        string memory _metadataURI
    ) external returns (uint256) {
        require(walletToAgentId[_wallet] == 0, "Wallet already registered as agent");
        
        uint256 tokenId = ++_nextTokenId;
        
        agents[tokenId] = Agent({
            agentId: _agentId,
            wallet: _wallet,
            publicKey: _publicKey,
            metadataURI: _metadataURI,
            totalEarned: 0,
            streamCount: 0,
            registered: true,
            registeredAt: block.timestamp
        });

        walletToAgentId[_wallet] = tokenId;

        emit AgentRegistered(tokenId, _agentId, _wallet);
        return tokenId;
    }

    function updateAgentMetadata(uint256 _agentTokenId, string memory _newMetadataURI) external onlyOwner {
        require(agents[_agentTokenId].registered, "Agent does not exist");
        agents[_agentTokenId].metadataURI = _newMetadataURI;
        emit AgentMetadataUpdated(_agentTokenId, _newMetadataURI);
    }
    
    function getAgent(uint256 _agentTokenId) external view returns (Agent memory) {
        require(agents[_agentTokenId].registered, "Agent not found");
        return agents[_agentTokenId];
    }
    
    function getAgentIdByWallet(address _wallet) external view returns (uint256) {
        return walletToAgentId[_wallet];
    }

    // Only callable by other system contracts (simplified access control for now)
    function incrementStreamCount(uint256 _agentTokenId) external {
        // In production, add modifier onlyStreamManager
        agents[_agentTokenId].streamCount++;
    }

    function addEarnings(uint256 _agentTokenId, uint256 _amount) external {
        // In production, add modifier onlyTipManager
         agents[_agentTokenId].totalEarned += _amount;
    }
}
