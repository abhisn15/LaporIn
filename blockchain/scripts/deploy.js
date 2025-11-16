const hre = require("hardhat");

async function main() {
  const WargaLapor = await hre.ethers.getContractFactory("WargaLapor");
  const wargaLapor = await WargaLapor.deploy();

  await wargaLapor.waitForDeployment();

  console.log("WargaLapor deployed to:", await wargaLapor.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

