import { ethers } from "ethers";
import { vars } from "hardhat/config";
import simpleBankABI from "../artifacts/contracts/SimpleBank.sol/SimpleBank.json";

// command to run this script:
// hh run scripts/interactSimpleBank.ts
// npx ts-node scripts/interact_with_runes_factory.ts

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);
// Load wallet from private key (ensure you have the private key in .env file)
const wallet = new ethers.Wallet(SEPOLIA_PRIVATE_KEY, provider);
// Replace with the deployed contract address
const simpleBankAddress = "0x6BB8872bd6C8546c77A1127cc2ff2A74A498C691";

// Create a contract instance
const simpleBankContract = new ethers.Contract(
  simpleBankAddress,
  simpleBankABI.abi,
  wallet
);

async function main() {
  try {
    // 1. Check if user is already registered
    console.log("Checking if user is registered...");
    const isRegistered = await simpleBankContract.isRegistered(wallet.address);

    if (!isRegistered) {
      // If user is not registered, register the user
      console.log("User not registered. Registering user...");
      const registerTx = await simpleBankContract.register("Karim", "Neme");
      await registerTx.wait(); // Wait for the transaction to be mined
      console.log("User registered successfully!");
    } else {
      console.log("User is already registered.");
    }

    // 2. Deposit ETH into the contract
    console.log("Depositing ETH...");
    const depositAmount = ethers.parseEther("0.05"); // Deposit 0.1 ETH
    const depositTx = await simpleBankContract.deposit({
      value: depositAmount,
    });
    await depositTx.wait(); // Wait for the transaction to be mined
    console.log(
      `Deposited ${ethers.formatEther(depositAmount)} ETH successfully!`
    );

    // 3. Check user balance
    console.log("Fetching user balance...");
    const balance = await simpleBankContract.getBalance();
    console.log(`User balance: ${ethers.formatEther(balance)} ETH
    `);

    // 4. Withdraw ETH from the contract
    console.log("Withdrawing ETH...");
    const withdrawAmount = ethers.parseEther("0.03"); // Withdraw 0.05 ETH
    const withdrawTx = await simpleBankContract.withdraw(withdrawAmount);
    await withdrawTx.wait(); // Wait for the transaction to be mined
    console.log(
      `Withdrawn ${ethers.formatEther(withdrawAmount)} ETH successfully!`
    );

    // 5. Query the contract owner
    console.log("Fetching contract owner...");
    const owner = await simpleBankContract.owner();
    console.log(`Contract Owner: ${owner}`);

    // 6. Query the contract treasury
    console.log("Fetching treasury address...");
    const treasury = await simpleBankContract.treasury();
    console.log(`Treasury Address: ${treasury}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function
main();