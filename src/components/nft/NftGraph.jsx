import React from 'react';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';
import './NftGraph.scss';

import { BarChart, SimpleLineChart } from '../unit/Chart';

export const NftGraph = ({ barTitle, barGraphData, lineTitle, lineGraphData }) => {
  const barData =
    barGraphData &&
    Object?.entries(barGraphData)?.map(([key, value]) => {
      return { date: key, value: value };
    });

  const lineData = lineGraphData && [
    {
      id: 'Volume',
      data: Object?.entries(lineGraphData)?.map(([key, value]) => {
        return { x: key?.toUpperCase(), y: value };
      }),
    },
  ];

  return (
    <div className="nft-item__graph">
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">
          {barTitle || 'Transaction Volume'} (7-Day Fixed)
        </p>
        {barData && <BarChart data={barData} height={280} />}
      </div>
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">{lineTitle || 'Average Price'} (7-Day Fixed)</p>
        {lineData && <SimpleLineChart data={lineData} height={280} />}
      </div>
    </div>
  );
};
