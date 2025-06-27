// src/hooks/useNodeViewer.js
import { useQuery } from 'react-query';
import { getNodeViewer } from '../api/nodeViewerApi';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * 유저 지갑 주소를 불러오는 훅
 * @returns {object} - { data, isLoading, error }
 */
export const useNodeWalletAddress = () => {
  const { token } = useContext(AuthContext);
  return useQuery(['nodeViewer', token], () => getNodeViewer(token), {
    enabled: !!token,
    select: res => res.data[0]?.wallet_address || '',
  });
};
