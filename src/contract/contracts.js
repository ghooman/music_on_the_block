import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import {
  MARKET_PLACE_CONTRACT_ADDRESS,
  MOB_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
} from "./contractAddresses";

const client = createThirdwebClient({
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
});

// mob
export const mobContract = getContract({
  client,
  chain: defineChain(137),
  address: MOB_CONTRACT_ADDRESS,
});

// music nft
export const musicNftContract = getContract({
  client,
  chain: defineChain(137),
  address: MUSIC_NFT_CONTRACT_ADDRESS,
});

export const marketPlaceContract = getContract({
  client,
  chain: defineChain(137),
  address: MARKET_PLACE_CONTRACT_ADDRESS,
});
