import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

import './Chart.scss';

// 차트는 다시 작성하겠습니다.

export const PieChart = ({ height, width, data, selectedItem, setSelectedItem, legends }) => {
    const total = data ? data.reduce((a, b) => a + b.value, 0) : 0;

    const getColor = (datum) => {
        const hslString = datum?.data?.color;
        const hslRegex = /hsl\(\s*(\d+),\s*([\d.]+)%?,\s*([\d.]+)%?\s*\)/;
        const match = hslString.match(hslRegex);
        const lightness = selectedItem ? (selectedItem?.id === datum?.id ? 50 : 10) : 50;
        if (!match) return hslString; // 유효하지 않으면 원본 반환
        const [_, h, s] = match;
        return `hsl(${h}, 100%, ${lightness}%)`;
    };

    return (
        <div className="chart__pie" style={{ maxHeight: height, maxWidth: width, height, width: '100%' }}>
            <ResponsivePie
                sortByValue={true}
                activeId={selectedItem?.id}
                onClick={(e) => {
                    // console.log(e)
                    setSelectedItem(e.data);
                }}
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
                <p className="chart__pie--text-value" style={{ color: selectedItem?.color }}>
                    {selectedItem ? selectedItem?.value?.toLocaleString() : total}
                </p>
                <p className="chart__pie--text-per">
                    {selectedItem ? ((total / selectedItem?.value) * 10)?.toFixed(2) : 100}%
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

export const LineChart = ({ height = '500px', width = '100%' }) => {
    const data = [
        {
            id: 'japan',
            color: 'hsl(162, 70%, 50%)',
            data: [
                {
                    x: 'plane',
                    y: 30,
                },
                {
                    x: 'helicopter',
                    y: 73,
                },
                {
                    x: 'boat',
                    y: 18,
                },
                {
                    x: 'train',
                    y: 72,
                },
                {
                    x: 'subway',
                    y: 92,
                },
                {
                    x: 'bus',
                    y: 32,
                },
                {
                    x: 'car',
                    y: 22,
                },
            ],
        },
    ];

    return (
        <div style={{ maxHeight: height, maxWidth: width, height, width: '100%' }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                curve="cardinal"
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 100,
                    stacked: true,
                    reverse: false,
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                enableGridX={false}
                pointSize={0}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="data.yFormatted"
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
            />
        </div>
    );
};
