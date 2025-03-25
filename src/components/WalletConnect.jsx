import { useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
// import { ConnectButton } from "thirdweb/react";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const WalletConnect = ({setLogin}) => {
  const client = createThirdwebClient({
    clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
  });

  const wallets = [
    inAppWallet({
      auth: {
        options: ["email", "google"],
      },
    }),
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];

  const activeWallet = useActiveWallet();

  // 연결 상태 감지해서 로그인 상태 전달
  useEffect(() => {
    setLogin(!!activeWallet);
  }, [activeWallet, setLogin]);

  return <ConnectButton client={client} wallets={wallets} />;
};
