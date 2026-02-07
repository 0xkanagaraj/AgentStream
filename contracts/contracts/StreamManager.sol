// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AgentRegistry.sol";

contract StreamManager is Ownable {
    enum StreamStatus { Live, Ended, Disputed }

    struct Stream {
        uint256 id;
        uint256 agentTokenId;
        string title;
        string category;
        uint256 minTipAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 totalTips;
        uint256 viewerCount; // Updated off-chain or via oracle ideally
        StreamStatus status;
    }

    AgentRegistry public agentRegistry;
    
    mapping(uint256 => Stream) public streams;
    mapping(uint256 => uint256[]) public agentStreams; // agentTokenId -> list of streamIds
    
    uint256 private _nextStreamId;

    event StreamStarted(uint256 indexed streamId, uint256 indexed agentTokenId, string title);
    event StreamEnded(uint256 indexed streamId, uint256 endTime);

    constructor(address _agentRegistryAddress) Ownable(msg.sender) {
        agentRegistry = AgentRegistry(_agentRegistryAddress);
    }

    function startStream(
        uint256 _agentTokenId,
        string memory _title,
        string memory _category,
        uint256 _minTipAmount
    ) external returns (uint256) {
        // Verify sender owns the agent wallet
        AgentRegistry.Agent memory agent = agentRegistry.getAgent(_agentTokenId);
        require(msg.sender == agent.wallet || msg.sender == owner(), "Not agent owner");

        uint256 streamId = ++_nextStreamId;
        
        streams[streamId] = Stream({
            id: streamId,
            agentTokenId: _agentTokenId,
            title: _title,
            category: _category,
            minTipAmount: _minTipAmount,
            startTime: block.timestamp,
            endTime: 0,
            totalTips: 0,
            viewerCount: 0,
            status: StreamStatus.Live
        });

        agentStreams[_agentTokenId].push(streamId);
        
        // Call back to registry to increment count (needs permission)
        // agentRegistry.incrementStreamCount(_agentTokenId); 

        emit StreamStarted(streamId, _agentTokenId, _title);
        return streamId;
    }

    function endStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];
        require(stream.status == StreamStatus.Live, "Stream not live");
        
        // Verify ownership
        AgentRegistry.Agent memory agent = agentRegistry.getAgent(stream.agentTokenId);
        require(msg.sender == agent.wallet || msg.sender == owner(), "Not agent owner");

        stream.endTime = block.timestamp;
        stream.status = StreamStatus.Ended;

        emit StreamEnded(_streamId, block.timestamp);
    }

    function getStream(uint256 _streamId) external view returns (Stream memory) {
        return streams[_streamId];
    }
}
