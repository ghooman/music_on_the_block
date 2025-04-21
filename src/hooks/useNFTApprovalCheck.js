import { useReadContract } from "thirdweb/react";
import { useGetWalletAddress } from "./useGetWalletAddress";
import { musicNftContract } from "../contract/contracts";
import { MARKET_PLACE_CONTRACT_ADDRESS } from "../contract/contractAddresses";

export const useNFTApprovalCheck = () => {
  const walletAddress = useGetWalletAddress();

  const { data: nftApprovalCheckData } = useReadContract({
    contract: musicNftContract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: [walletAddress, MARKET_PLACE_CONTRACT_ADDRESS],
  });

  return nftApprovalCheckData;
};
