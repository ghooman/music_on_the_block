import { useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { polygon } from "thirdweb/chains";
// import { ConnectButton } from "thirdweb/react";
import {
  ConnectButton,
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const WalletConnect = ({ setLogin }) => {
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
  console.log("walletStatus", walletStatus);

  const emailAddress = useActiveWallet();
  console.log("emailAddress", emailAddress && Object.keys(emailAddress));
  console.log("emailAddress", emailAddress?.getAccount);

  // 연결 상태 감지해서 로그인 상태 전달
  useEffect(() => {
    setLogin(walletStatus === "connected");
  }, [walletStatus, setLogin]);

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
        sessionStorage.removeItem("wallet_status");
      }}
    />
  );
};
