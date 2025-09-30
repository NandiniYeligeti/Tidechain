import { ethers } from "ethers";
import contracts from "./contracts.json";

// Type definitions for MetaMask injected object
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Connects to the browser's wallet (e.g., MetaMask)
export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (window.ethereum) {
    // Request wallet access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Optional: check if the user is on the correct network (Amoy)
    const network = await provider.getNetwork();
    if (network.name !== "amoy") {
      alert("Please switch to the Amoy network in MetaMask.");
    }

    return provider;
  } else {
    alert("Please install MetaMask!");
    throw new Error("MetaMask not found");
  }
}

// Get contract instances connected with signer
export async function getContracts(): Promise<{
  creditToken: ethers.Contract;
  registry: ethers.Contract;
  signer: ethers.Signer;
}> {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const creditToken = new ethers.Contract(
    contracts.CreditToken.address,
    contracts.CreditToken.abi,
    signer
  );

  const registry = new ethers.Contract(
    contracts.Registry.address,
    contracts.Registry.abi,
    signer
  );

  return { creditToken, registry, signer };
}
