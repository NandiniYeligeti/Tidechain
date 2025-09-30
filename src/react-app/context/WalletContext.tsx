import React, { createContext, useState, useEffect } from "react";

interface WalletContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  // ✅ Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        alert("MetaMask not detected! Please install it.");
        return;
      }

      const provider = (window as any).ethereum;
      const accounts = await provider.request({ method: "eth_requestAccounts" });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]); // persist login
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // ✅ Disconnect wallet
  const disconnectWallet = () => {
    setAddress(null);
    localStorage.removeItem("walletAddress");
  };

  // ✅ Auto-load wallet if already connected
  useEffect(() => {
    const saved = localStorage.getItem("walletAddress");
    if (saved) {
      setAddress(saved);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ address, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
