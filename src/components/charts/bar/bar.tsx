import PieChartWithLegend from '../pie/pie';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({
  data,
  colors,
  header,
  textArray,
  description,
  mainInfo,
  size = 'small',
  gridColumn,
  type = 'pie'
}) => {
  return (
    <div className={`flex flex-col justify-between items-start p-8 gap-20 bg-white bg-opacity-80 backdrop-filter rounded-2xl `} style={{gridColumn}}>
      <div className="flex flex-col items-start gap-8">
        <div className="font-medium text-xs leading-150 text-left tracking-wider uppercase text-gray-400">{header}</div>
        <div className="flex flex-col items-start">
          <div className="font-bold text-4xl leading-150 text-left tracking-tighter text-gray-900">{`${mainInfo} ${replaceEnding(mainInfo, textArray)}`}</div>
          <div className="font-normal text-xs text-left leading-150 text-gray-700">{description}</div>
        </div>
      </div>
      {type === 'pie' ? (
        <PieChartWithLegend data={data} colors={colors} size={size}></PieChartWithLegend>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={600}
            height={300}
            data={data}
            margin={{ left: -32 }}
          >
            <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#111928' }} stroke="#9CA3AF" interval={0} />
            <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#111928' }} stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="value" fill="#6875F5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;



const replaceEnding = (
    number: number | string,
    textArray: [string, string, string] | undefined
) => {
    const cases = [2, 0, 1, 1, 1, 2];
    const num = number as number
    return (
        textArray ? textArray[
            num % 100 > 4 && num % 100 < 20
                ? 2
                : cases[num % 10 < 5 ? num % 10 : 5]
        ] : '');
};

