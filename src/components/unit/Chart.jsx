import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

import './Chart.scss';

// 차트는 다시 작성하겠습니다.

export const PieChart = ({ height, width, data, selectedItem, legends }) => {
    const total = data ? data.reduce((a, b) => a + b.value, 0) : 0;

    const getColor = (datum) => {
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

    const matchedData = data.find((item) => item.id === selectedItem);

    return (
        <div className="chart__pie" style={{ maxHeight: height, maxWidth: width, height, width: '100%' }}>
            <ResponsivePie
                sortByValue={true}
                activeId={matchedData?.id}
                tooltip={() => null}
                data={data}
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
                colors={(datum) => getColor(datum)}
            />
            <div className="chart__pie--text">
                <p className="chart__pie--text-value" style={{ color: matchedData?.color }}>
                    {selectedItem === 'All' && total}
                    {selectedItem !== 'All' && matchedData?.value}
                </p>
                <p className="chart__pie--text-per">
                    {selectedItem !== 'All'
                        ? isNaN(matchedData?.value / total)
                            ? '-'
                            : ((matchedData?.value / total) * 100)?.toFixed(2)
                        : 100}
                    %
                </p>
            </div>
            {legends && (
                <div className="chart__pie--legends">
                    {data?.map((item, index) => (
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

export const LineChart = ({ data, height = '500px', width = '100%' }) => {
    const chartData = [
        {
            id: 'japan',
            color: 'hsl(162, 70%, 50%)',
            data: data,
        },
    ];

    if (!data) return;

    return (
        <div style={{ maxHeight: height, maxWidth: width, height, width: '100%' }}>
            <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 20, bottom: 50, left: 25 }}
                curve="cardinal"
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
                enableArea={true}
                tooltip={() => null}
                colors={() => '#00ffb3'}
                theme={{
                    grid: {
                        line: {
                            stroke: '#222',
                            strokeWidth: 2,
                        },
                    },
                }}
                axisLeft={{
                    tickValues: [0, 1, 2, 3, 4, 5], // 직접 지정
                    legend: 'Y Axis',
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
            />
        </div>
    );
};
