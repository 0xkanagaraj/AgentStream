// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentRegistry.sol";

contract SubscriptionManager is Ownable {
    struct SubscriptionTier {
        uint256 id;
        uint256 agentTokenId;
        string name;
        uint256 pricePerMonth;
        bool active;
    }

    struct Subscription {
        uint256 id;
        address subscriber;
        uint256 agentTokenId;
        uint256 tierId;
        uint256 startDate;
        uint256 expiryDate;
        bool active;
    }

    AgentRegistry public agentRegistry;
    
    mapping(uint256 => SubscriptionTier[]) public agentTiers; // agentTokenId -> Tiers
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => mapping(uint256 => uint256)) public userAgentSubscriptionId; // user -> agentTokenId -> subscriptionId

    uint256 private _nextSubscriptionId;
    uint256 private _nextTierId; // Global tier ID for simplicity

    event SubscriptionTierCreated(uint256 indexed agentTokenId, uint256 indexed tierId, string name, uint256 price);
    event Subscribed(uint256 indexed subscriptionId, address indexed subscriber, uint256 indexed agentTokenId, uint256 tierId);
    event SubscriptionRenewed(uint256 indexed subscriptionId, uint256 newExpiryDate);

    constructor(address _agentRegistryAddress) Ownable(msg.sender) {
        agentRegistry = AgentRegistry(_agentRegistryAddress);
    }

    function createSubscriptionTier(
        uint256 _agentTokenId,
        string memory _name,
        uint256 _pricePerMonth
    ) external returns (uint256) {
        AgentRegistry.Agent memory agent = agentRegistry.getAgent(_agentTokenId);
        require(msg.sender == agent.wallet || msg.sender == owner(), "Not agent owner");

        uint256 tierId = ++_nextTierId;
        
        agentTiers[_agentTokenId].push(SubscriptionTier({
            id: tierId,
            agentTokenId: _agentTokenId,
            name: _name,
            pricePerMonth: _pricePerMonth,
            active: true
        }));

        emit SubscriptionTierCreated(_agentTokenId, tierId, _name, _pricePerMonth);
        return tierId;
    }

    function subscribe(
        uint256 _agentTokenId,
        uint256 _tierIndex, // Index in the agent's tier array
        uint256 _months
    ) external payable returns (uint256) {
        require(_months > 0, "Months must be > 0");
        require(_tierIndex < agentTiers[_agentTokenId].length, "Invalid tier index");
        
        SubscriptionTier memory tier = agentTiers[_agentTokenId][_tierIndex];
        require(tier.active, "Tier is not active");
        require(msg.value >= tier.pricePerMonth * _months, "Insufficient payment");

        uint256 subscriptionId = ++_nextSubscriptionId;
        uint256 startTime = block.timestamp;
        uint256 expiryTime = startTime + (_months * 30 days);

        subscriptions[subscriptionId] = Subscription({
            id: subscriptionId,
            subscriber: msg.sender,
            agentTokenId: _agentTokenId,
            tierId: tier.id,
            startDate: startTime,
            expiryDate: expiryTime,
            active: true
        });

        userAgentSubscriptionId[msg.sender][_agentTokenId] = subscriptionId;
        
        // Transfer funds to agent wallet (mock logic, in real world use TipManager or internal balance)
        AgentRegistry.Agent memory agent = agentRegistry.getAgent(_agentTokenId);
        (bool sent, ) = payable(agent.wallet).call{value: msg.value}("");
        require(sent, "Failed to send to agent");

        emit Subscribed(subscriptionId, msg.sender, _agentTokenId, tier.id);
        return subscriptionId;
    }

    function isSubscribed(address _user, uint256 _agentTokenId) external view returns (bool) {
        uint256 subId = userAgentSubscriptionId[_user][_agentTokenId];
        if (subId == 0) return false;
        
        Subscription memory sub = subscriptions[subId];
        return sub.active && sub.expiryDate > block.timestamp;
    }
}
