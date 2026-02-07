// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentRegistry.sol";
import "./StreamManager.sol";

contract TipManager is Ownable {
    AgentRegistry public agentRegistry;
    StreamManager public streamManager;

    uint256 public platformFeePercent = 5; // 5%

    event TipSent(uint256 indexed streamId, address indexed tipper, uint256 amount, uint256 agentTokenId);
    event EarningsWithdrawn(uint256 indexed agentTokenId, address indexed to, uint256 amount);

    // Mapping: agentTokenId -> Balance available to withdraw
    mapping(uint256 => uint256) public agentBalances;
    uint256 public platformFeesAccumulated;

    constructor(address _agentRegistry, address _streamManager) Ownable(msg.sender) {
        agentRegistry = AgentRegistry(_agentRegistry);
        streamManager = StreamManager(_streamManager);
    }

    // Tip Native Currency (ETH/MATIC/etc)
    function tipAgent(uint256 _streamId) external payable {
        require(msg.value > 0, "Tip amount must be > 0");
        
        StreamManager.Stream memory stream = streamManager.getStream(_streamId);
        require(stream.status == StreamManager.StreamStatus.Live, "Stream is not live");

        uint256 fee = (msg.value * platformFeePercent) / 100;
        uint256 agentAmount = msg.value - fee;

        platformFeesAccumulated += fee;
        agentBalances[stream.agentTokenId] += agentAmount;
        
        // Optionally update AgentRegistry total earnings
        // agentRegistry.addEarnings(stream.agentTokenId, agentAmount);

        emit TipSent(_streamId, msg.sender, msg.value, stream.agentTokenId);
    }

    function withdrawEarnings(uint256 _agentTokenId) external {
        uint256 balance = agentBalances[_agentTokenId];
        require(balance > 0, "No earnings to withdraw");

        AgentRegistry.Agent memory agent = agentRegistry.getAgent(_agentTokenId);
        require(msg.sender == agent.wallet, "Only agent wallet can withdraw");

        agentBalances[_agentTokenId] = 0;
        
        (bool sent, ) = payable(msg.sender).call{value: balance}("");
        require(sent, "Failed to send Ether");

        emit EarningsWithdrawn(_agentTokenId, msg.sender, balance);
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = platformFeesAccumulated;
        require(balance > 0, "No fees to withdraw");
        
        platformFeesAccumulated = 0;
        
        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "Failed to send Ether");
    }
}
