import { createThirdwebClient, defineChain, getContract } from 'thirdweb';
import {
  MARKET_PLACE_CONTRACT_ADDRESS,
  MOB_CONTRACT_ADDRESS,
  MUSIC_NFT_CONTRACT_ADDRESS,
  POL_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  MOB_NFT_CONTRACT_ADDRESS,
} from './contractAddresses';

const client = createThirdwebClient({
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
});

const chain = defineChain(137); // Polygon 메인넷

// mob token
export const mobContract = getContract({
  client,
  chain,
  address: MOB_CONTRACT_ADDRESS,
});

// POL token (ERC-20이 아닐 수 있음)
export const polContract = getContract({
  client,
  chain,
  address: POL_CONTRACT_ADDRESS,
});

// USDT token
export const usdtContract = getContract({
  client,
  chain,
  address: USDT_CONTRACT_ADDRESS,
});

// USDC token
export const usdcContract = getContract({
  client,
  chain,
  address: USDC_CONTRACT_ADDRESS,
});

// music NFT
export const musicNftContract = getContract({
  client,
  chain,
  address: MUSIC_NFT_CONTRACT_ADDRESS,
});

// marketplace
export const marketPlaceContract = getContract({
  client,
  chain,
  address: MARKET_PLACE_CONTRACT_ADDRESS,
});

// node
export const mobNftContract = getContract({
  client,
  chain: defineChain(137),
  address: MOB_NFT_CONTRACT_ADDRESS,
});
