import { ResponsivePie } from '@nivo/pie';

import './Chart.scss';

export const PieChart = ({ height, width, data, selectedItem, setSelectedItem }) => {
    const total = data.reduce((a, b) => a + b.value, 0);

    const getColor = (datum) => {
        const hslString = datum?.data?.color;
        const hslRegex = /hsl\(\s*(\d+),\s*([\d.]+)%?,\s*([\d.]+)%?\s*\)/;
        const match = hslString.match(hslRegex);
        const lightness = selectedItem?.id === datum?.id ? 50 : 10;
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
                    {selectedItem?.value?.toLocaleString()}
                </p>
                <p className="chart__pie--text-per">{((total / selectedItem?.value) * 10)?.toFixed(2)}%</p>
            </div>
            <div className="chart__pie--legends">
                {data.map((item) => (
                    <div className="chart__pie--legends__item">
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
        </div>
    );
};
