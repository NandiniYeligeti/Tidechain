import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const Connect = () => {
  const { connectWallet } = useContext(WalletContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Tidechain</h1>
      <button
        onClick={connectWallet}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default Connect;
