import React from 'react';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';
import './NftGraph.scss';

import { BarChart, SimpleLineChart } from '../unit/Chart';

export const NftGraph = ({ transactionCountData, transactionPriceData }) => {
  const barData =
    transactionCountData &&
    Object?.entries(transactionCountData)?.map(([key, value]) => {
      return { date: key?.toUpperCase(), value: value };
    });

  const lineData = transactionPriceData && [
    {
      id: 'Volume',
      data: Object?.entries(transactionPriceData)?.map(([key, value]) => {
        return { x: key, y: value };
      }),
    },
  ];

  return (
    <div className="nft-item__graph">
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">Transaction Volume (7-Day Fixed)</p>
        {/* <img src={graph1Img01} alt="Transaction Volume" /> */}
        {barData && <BarChart data={barData} height={280} />}
      </div>
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">Average Price (7-Day Fixed)</p>
        {/* <img src={graph1Img02} alt="NFT Issuance" /> */}
        {lineData && <SimpleLineChart data={lineData} height={280} />}
      </div>
    </div>
  );
};
