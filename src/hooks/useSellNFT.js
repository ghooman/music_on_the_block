import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { marketPlaceContract } from "../contract/contracts";

export const useSellNFT = () => {
  const { mutateAsync: sendAndConfirmTransaction } =
    useSendAndConfirmTransaction();

  const sellMusicNft = async () => {
    try {
      console.log("sellMusicNft 실행");
      const transaction = prepareContractCall({
        contract: marketPlaceContract,
        method:
          "function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)",
        params: ["_params"],
      });
      const receipt = await sendAndConfirmTransaction(transaction);
      console.log("sellMusicNft receipt:", receipt);
    } catch (error) {
      console.error("Error during sellMusicNft:", error.message);
      throw error;
    }
  };
};
