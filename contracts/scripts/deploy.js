const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy AgentRegistry
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy();
  await agentRegistry.waitForDeployment();
  console.log("AgentRegistry deployed to:", await agentRegistry.getAddress());

  // 2. Deploy StreamManager
  const StreamManager = await hre.ethers.getContractFactory("StreamManager");
  const streamManager = await StreamManager.deploy(await agentRegistry.getAddress());
  await streamManager.waitForDeployment();
  console.log("StreamManager deployed to:", await streamManager.getAddress());

  // 3. Deploy TipManager
  const TipManager = await hre.ethers.getContractFactory("TipManager");
  const tipManager = await TipManager.deploy(await agentRegistry.getAddress(), await streamManager.getAddress());
  await tipManager.waitForDeployment();
  console.log("TipManager deployed to:", await tipManager.getAddress());

  // 4. Deploy SubscriptionManager
  const SubscriptionManager = await hre.ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy(await agentRegistry.getAddress());
  await subscriptionManager.waitForDeployment();
  console.log("SubscriptionManager deployed to:", await subscriptionManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
