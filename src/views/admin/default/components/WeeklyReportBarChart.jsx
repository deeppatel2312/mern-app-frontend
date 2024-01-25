import React, { useEffect, useState } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import {
  MdOutlineCalendarToday,
} from "react-icons/md";
import Card from "components/card";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";
import LineChart from "components/charts/LineChart";
import Dropdown from "components/dropdown";
import BarChartUpdated from "components/charts/BarChartUpdated";

const WeeklyReportBarChart = ({ selectedStartDate, selectedEndDate }) => {
  // const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  // const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [chartValue, setchartValue] = useState([]);
  const [chartOptions, setchartOptions] = useState({});
  let usersValue = []
  let providerValue = []
  let userProviderOptions = []
  useEffect(() => {
    getTransactions()
  }, [selectedEndDate, selectedStartDate])

  const getTransactions = async () => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/transaction/findByDateRange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fromDate: selectedStartDate,
        toDate: selectedEndDate
        // toDate: new Date(Date.parse(date) + 604800000)
      })
    }).then(resp => resp.json())
      .then((res) => {
        let days = []
        let values = []
        // for (let key in res) {
        //   days.push(key)
        //   values.push(res[key])
        // }
        res.map((ele) => {
          days.push(ele.time)
          values.push(ele.value)
        })
        usersValue = values
        userProviderOptions = days
        setValueInChart(values, days)
      })
  }

  const setValueInChart = (values, days) => {
    let chartVal = [
      {
        name: "Weekly Report",
        data: values,
        color: "#4318FF",
      },
    ];
    let chartOpt = {
      chart: {
        type: "bar",

        toolbar: {
          show: false,
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        type: "text",
        range: undefined,
        categories: days,
      },

      yaxis: [
        {
          title: {
            text: "Weekly Report",
            style: {
              color: "#4318FF"
            }
          }
        }
      ],
    };
    setchartOptions(chartOpt)
    setchartValue(chartVal)
  }

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <BarChartUpdated
            options={chartOptions}
            series={chartValue}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyReportBarChart;
