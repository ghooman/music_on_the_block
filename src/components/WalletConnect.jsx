// src/components/WalletConnect.jsx
import { useEffect, useContext } from "react";
import { createThirdwebClient } from "thirdweb";
import { polygon } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AuthContext } from "../contexts/AuthContext";
import { useQueryClient } from "react-query";

export const WalletConnect = ({ onConnect }) => {
  const client = createThirdwebClient({
    clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
  });

  const { logout } = useContext(AuthContext);
  const queryClient = useQueryClient(); // React Query의 queryClient 사용

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
        localStorage.removeItem("walletAddress");
        logout(); // AuthContext의 상태 초기화
        queryClient.resetQueries("userDetail"); // React Query 캐시 초기화
      }}
    />
  );
};
