import React from 'react';
import graph1Img01 from '../../assets/images/nft/praph-img01.png';
import graph1Img02 from '../../assets/images/nft/graph02-img.png';
import './NftGraph.scss';

import { BarChart, SimpleLineChart } from '../unit/Chart';
// import BarChart from '../unit/Chart';
// import SimpleLineChart from '../unit/Chart';

// import BarChart from '../unit/Chart';
// import BarChart, { SimpleLineChart } from '../unit/Chart';

export const NftGraph = () => {
  const sampleBarData = [
    { date: '4/12', value: 900 },
    { date: '4/13', value: 890 },
    { date: '4/14', value: 750 },
    { date: '4/15', value: 1000 },
    { date: '4/16', value: 1020 },
    { date: '4/17', value: 970 },
  ];

  const sampleLineData = [
    {
      id: 'Volume',
      data: [
        { x: 'MON', y: 1800 },
        { x: 'TUE', y: 3200 },
        { x: 'WED', y: 2900 },
        { x: 'THU', y: 2500 },
        { x: 'FRI', y: 1300 },
        { x: 'SAT', y: 4300 },
        { x: 'SUN', y: 2600 },
      ],
    },
  ];

  return (
    <div className="nft-item__graph">
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">Transaction Volume (14-Day Fixed)</p>
        {/* <img src={graph1Img01} alt="Transaction Volume" /> */}
        <BarChart data={sampleBarData} height={280} />
      </div>
      <div className="nft-item__graph--img">
        <p className="nft-item__graph--img__title">Average Price (14-Day Fixed)</p>
        {/* <img src={graph1Img02} alt="NFT Issuance" /> */}
        <SimpleLineChart data={sampleLineData} height={280} />
      </div>
    </div>
  );
};
