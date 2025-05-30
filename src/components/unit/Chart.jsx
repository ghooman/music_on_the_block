import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveRadar } from '@nivo/radar';

import './Chart.scss';
import { useEffect, useState } from 'react';

// 차트는 다시 작성하겠습니다.

export const PieChart = ({ height, width, data, selectedItem, legends }) => {
  const total = data ? data.reduce((a, b) => a + b.value, 0) : 0;
  const [renderData, setRenderData] = useState([{}]);

  const getColor = datum => {
    if (!renderData.find(item => item.value)) return;

    const hslString = datum?.data?.color;
    const hslRegex = /hsl\(\s*(\d+),\s*([\d.]+)%?,\s*([\d.]+)%?\s*\)/;
    const match = hslString.match(hslRegex);
    const lightness = selectedItem === datum?.id ? 50 : 10;
    if (!match) return hslString; // 유효하지 않으면 원본 반환
    const [_, h, s] = match;
    if (selectedItem === 'All') {
      return `hsl(${h}, 100%, ${50}%)`;
    }
    return `hsl(${h}, 100%, ${lightness}%)`;
  };

  const matchedData = data.find(item => item.id === selectedItem);

  useEffect(() => {
    if (!data) return;
    let TO;
    TO = setTimeout(() => {
      setRenderData(data);
    }, 100);

    return () => {
      clearTimeout(TO);
    };
  }, [data]);

  return (
    <div
      className="chart__pie"
      style={{ maxHeight: height, maxWidth: width, height, width: '100%' }}
    >
      <ResponsivePie
        sortByValue={true}
        activeId={matchedData?.id}
        tooltip={() => null}
        data={renderData}
        margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
        innerRadius={0.5}
        padAngle={2}
        cornerRadius={15}
        activeOuterRadiusOffset={8}
        borderWidth={0}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLabelsSkipAngle={10}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        isInteractive={false}
        colors={datum => getColor(datum)}
      />
      <div className="chart__pie--text">
        <p className="chart__pie--text-value" style={{ color: matchedData?.color }}>
          {selectedItem === 'All' && (!isNaN(total) ? total : '0')}
          {selectedItem !== 'All' && (!isNaN(matchedData?.value) ? matchedData?.value : '0')}
        </p>
        <p className="chart__pie--text-per">
          {selectedItem !== 'All'
            ? isNaN(matchedData?.value / total)
              ? '-'
              : ((matchedData?.value / total) * 100)?.toFixed(2)
            : '100'}{' '}
          %
        </p>
      </div>
      {legends && (
        <div className="chart__pie--legends">
          {data &&
            data?.map((item, index) => (
              <div className="chart__pie--legends__item" key={`legends-${index}`}>
                <div
                  className="chart__pie--legends__item--square"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="chart__pie--legends__item--label-image">
                  <img src={item.image} alt={item.id} />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export const LineChart = ({ data, height = 300, width = '100%' }) => {
  const chartData = [
    {
      id: 'data',
      color: 'hsl(162, 70%, 50%)',
      data: data,
    },
  ];

  if (!data) return;

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        // curve="catmullRom"
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 5,
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        enableGridX={false}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        // enableArea={true}
        colors={() => '#00ffb3'}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: '#939699',
                fontSize: 12,
                textTransform: 'capitalize',
              },
            },
          },
          tooltip: { container: { background: '#111', color: '#fff', fontSize: 12 } },
          grid: {
            line: {
              stroke: '#222',
              strokeWidth: 2,
            },
          },
        }}
        axisLeft={{
          tickValues: [0, 1, 2, 3, 4, 5], // 직접 지정
        }}
      />
    </div>
  );
};

// components/unit/BarChart.jsx

export const BarChart = ({
  data,
  keys = ['value'],
  indexBy = 'date',
  height = 300,
  width = '100%',
}) => {
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    let max = 0;
    data?.forEach(item => {
      if (item.value > max) max = item.value;
    });
    const maxvalue = [10, 100, 1000, 10000, 100000];
    for (let i = 0; i < maxvalue.length; i++) {
      if (max < maxvalue[i]) {
        setMaxValue(maxvalue[i]);
        break;
      }
    }
  }, [data]);

  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="date"
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors="turquoise"
        maxValue={maxValue}
        enableLabel={false}
        /* ───── 축 & 눈금 ───── */
        axisBottom={{ tickSize: 0, tickPadding: 12, legendOffset: 32 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          // tickValues: Array.from({ length: maxValue + 1 }, (_, i) => i),
          legendOffset: -40,
        }}
        /* ───── 격자 ───── */
        enableGridX={false}
        enableGridY
        // gridYValues={[0, 200, 400, 600, 800, 1000]}
        /* ───── 스타일 ───── */
        theme={{
          textColor: '#fff',
          axis: {
            ticks: {
              text: { fill: '#888', fontSize: 12, textTransform: 'capitalize' },
              line: { stroke: '#333' },
            },
            domain: { line: { stroke: '#444' } },
          },
          grid: { line: { stroke: '#222', strokeWidth: 1 } },
          tooltip: { container: { background: '#111', color: '#fff', fontSize: 12 } },
        }}
        /* ───── 호버 효과 ───── */
        borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
        activeOpacity={1}
        inactiveOpacity={0.5}
      />
    </div>
  );
};

export const SimpleLineChart = ({ data, height = 300, color = '#a78bfa' }) => {
  console.log(data, '심플 라인 차트 데이터');

  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    let max = 0;
    if (!data) return;

    data?.[0].data.forEach(obj => {
      if (obj.y > max) {
        max = obj.y;
      }
    });

    const maxvalue = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
    for (const value of maxvalue) {
      if (max < value) {
        setMaxValue(value);
        break;
      }
    }
  }, [data]);

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: maxValue }} // 0~5000 고정
        curve="monotoneX"
        colors="#a78bfa"
        lineWidth={2}
        pointSize={0}
        enablePoints={false}
        useMesh
        /* ───── 축 & 눈금 ───── */
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0,
          legend: '',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          // tickValues: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000], // 눈금 위치
          legend: '',
          legendOffset: -40,
        }}
        /* ───── 격자선 ───── */
        enableGridX={false}
        enableGridY={true}
        // gridYValues={[0, 1000, 2000, 3000, 4000, 5000]}
        /* ───── 테마(색상) ───── */
        theme={{
          // background: '#000',
          textColor: '#fff',
          axis: {
            ticks: {
              text: { fill: '#888', fontSize: 12, textTransform: 'capitalize' },
              line: { stroke: '#333' },
            },
            domain: { line: { stroke: 'transparent' } },
          },
          grid: { line: { stroke: '#222', strokeWidth: 1 } },
          tooltip: {
            // container: { background: '#1a1a1a', color: '#fff', fontSize: 12 },
          },
        }}
        tooltip={() => null}
      />
    </div>
  );
};

const radarDummy = [
  { item: '80 (Emotion)', value: 80 },
  { item: 'Creativity', value: 90 },
  { item: 'Structure', value: 70 },
  { item: 'Sound', value: 80 },
  { item: 'Popularity', value: 90 },
];

export const RadarChart = ({
  data = radarDummy, // 넘겨주는 데이터가 없으면 더미 사용
  height = '100%',
  width = '100%',
}) => (
  <div style={{ height, width }}>
    <ResponsiveRadar
      /* ───── 핵심 파라미터 ───── */
      data={data}
      keys={['value']} // 축 레이블
      indexBy="item" // 다각형 구분 필드
      /* ───── 레이아웃 ───── */
      // maxValue="auto"
      margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
      gridShape="linear"
      gridLevels={8}
      curve="linearClosed"
      valueFormat=">-.2f"
      /* ───── 스타일 ───── */
      colors={['#cf0']}
      fillOpacity={0.5}
      borderWidth={2}
      borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
      dotSize={4}
      dotColor={{ theme: 'background' }}
      dotBorderWidth={2}
      gridLabelOffset={8}
      /* ───── 모션 & 인터랙션 ───── */
      motionConfig="wobbly"
      isInteractive={false}
      maxValue={100}
      /* ───── 테마 (축·격자 색상) ───── */
      theme={{
        axis: { ticks: { text: { fill: '#fff', fontSize: 14 } } },
        grid: { line: { stroke: '#0F71B8', strokeWidth: 1 } },
      }}
    />
  </div>
);
