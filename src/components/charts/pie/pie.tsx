import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import CustomLegend from "../legend/legend";


const PieChartWithLegend = ({ data, colors, size = "small" }) => {
  const chartWidth = size === "small" ? 100 : 160;
  const chartHeight = size === "small" ? 100 : 160;
  const pieWidth = size === "small" ? 50 : 80;
  const pieHeight = size === "small" ? 50 : 80;
  const outerRadius = size === "small" ? 45 : 70;
  const innerRadius = size === "small" ? 30 : 50;

  return (
    <div className="flex flex-row justify-between items-center gap-32">
      <ResponsiveContainer width={chartWidth} height={chartHeight}>
        <PieChart width={pieWidth} height={pieHeight}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            startAngle={90}
            endAngle={-270}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={2}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip wrapperStyle={{ outline: 0, borderRadius: 24 }} />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend data={data} colors={colors} />
    </div>
  );
};

export default PieChartWithLegend;
