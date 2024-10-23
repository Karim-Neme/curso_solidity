import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// deploy command
// npx hardhat ignition deploy ignition/modules/SimpleBank.ts --network <network> --verify

const BASIS_POINTS_FEE = 100; // Default 1% fee (100 basis points)
const TREASURY_ADDRESS = "0x70A3eDbb2De674119104dA29e26B033De65d99F2"; // Replace with actual treasury address

const SimpleBankModule = buildModule("SimpleBankModule", (m) => {
  const fee = m.getParameter("fee", BASIS_POINTS_FEE);
  const treasury = m.getParameter("treasury", TREASURY_ADDRESS);

  const simpleBank = m.contract("SimpleBank", [fee, treasury]);

  return { simpleBank };
});

export default SimpleBankModule;