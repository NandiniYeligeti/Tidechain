import { useEffect, useState } from "react";
import { getContracts, getProvider } from "../contract";


const TestContracts = () => {
  const [creditTokenAddress, setCreditTokenAddress] = useState<string>("");
  const [registryAddress, setRegistryAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const { creditToken, registry } = await getContracts();
        setCreditTokenAddress(creditToken.address);
        setRegistryAddress(registry.address);

        const provider = await getProvider();
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();

        const tokenBalance = await creditToken.balanceOf(signerAddress);
        setBalance(tokenBalance.toString());
      } catch (err) {
        console.error("Error fetching contracts:", err);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Contracts</h2>
      <p><strong>CreditToken Address:</strong> {creditTokenAddress}</p>
      <p><strong>Registry Address:</strong> {registryAddress}</p>
      <p><strong>Your CreditToken Balance:</strong> {balance}</p>
    </div>
  );
};

export default TestContracts;
