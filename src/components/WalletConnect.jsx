// src/components/WalletConnect.jsx
import { useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { polygon } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const WalletConnect = ({ onConnect }) => {
  const client = createThirdwebClient({
    clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
  });

  const wallets = [
    inAppWallet({
      auth: {
        options: ["google"],
      },
    }),
    createWallet("io.metamask"),
    createWallet("walletConnect"),
  ];

  const walletStatus = useActiveWalletConnectionStatus();
  const activeWallet = useActiveWallet();

  // 로그인 성공 시 지갑 주소 전달
  useEffect(() => {
    if (
      walletStatus === "connected" &&
      activeWallet &&
      activeWallet.getAccount
    ) {
      const walletAddress = activeWallet.getAccount();
      onConnect(true, walletAddress);
    } else {
      onConnect(false, null);
    }
  }, [walletStatus, activeWallet, onConnect]);

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      accountAbstraction={{
        chain: polygon,
        factoryAddress: process.env.REACT_APP_ACCOUNT_MANAGER,
        gasless: false,
      }}
      onDisconnect={() => {
        localStorage.removeItem("wallet_status");
      }}
    />
  );
};
