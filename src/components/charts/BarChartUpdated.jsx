import Chart from "react-apexcharts";

const BarChartUpdated = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="bar"
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default BarChartUpdated;
