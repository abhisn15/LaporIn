const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract ABI (simplified)
const CONTRACT_ABI = [
  "function logReportEvent(uint256 reportId, string memory status, string memory metaHash) public",
  "function logBantuanEvent(uint256 bantuanId, string memory jenisBantuan, uint256 nominal, address recipient) public",
  "event ReportEventCreated(uint256 indexed reportId, string status, address actor, uint256 timestamp, string metaHash)"
];

let contract;

async function initContract() {
  if (!contract) {
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      wallet
    );
  }
  return contract;
}

async function logReportToBlockchain(reportId, status, metaHash) {
  try {
    const contractInstance = await initContract();
    const tx = await contractInstance.logReportEvent(reportId, status, metaHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Blockchain error:', error);
    return null;
  }
}

async function logBantuanToBlockchain(bantuanId, jenisBantuan, nominal, recipientAddress) {
  try {
    const contractInstance = await initContract();
    const tx = await contractInstance.logBantuanEvent(
      bantuanId,
      jenisBantuan,
      ethers.parseEther(nominal.toString()),
      recipientAddress
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Blockchain error:', error);
    return null;
  }
}

module.exports = {
  logReportToBlockchain,
  logBantuanToBlockchain,
};

