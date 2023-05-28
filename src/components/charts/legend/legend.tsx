interface LegendItem {
    name: string;
  }
  
  interface CustomLegendProps {
    data: LegendItem[];
    colors: string[];
  }
  
  const CustomLegend: React.FC<CustomLegendProps> = ({ data, colors }) => {
    return <div className="flex flex-col items-start gap-8">
      {data.map((item, index) => (
        <div key={item.name} className="flex flex-row items-start gap-8">
          <div
            className="w-8 h-8 rounded-full mt-4"
            style={{ background: colors[index] }}
          />
          <div className="font-normal text-xs text-left leading-130 text-gray-900">
            {item.name}
          </div>
        </div>
      ))}
    </div>
}
  
  export default CustomLegend;
  