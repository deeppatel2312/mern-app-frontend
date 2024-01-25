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

const TotalSpent = ({ selectedStartDate, selectedEndDate }) => {
  // const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  // const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [chartValue, setchartValue] = useState([]);
  const [chartOptions, setchartOptions] = useState({});
  let usersValue = []
  let providerValue = []
  let userProviderOptions = []
  useEffect(() => {
    getUsers()
  }, [selectedStartDate, selectedEndDate])

  const getUsers = async () => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findByDateRange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        toDate: selectedEndDate,
        fromDate: selectedStartDate
        // fromDate: new Date(Date.parse(selectedStartDate) - 604800000)
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
        getProviders()
      })
  }
  const getProviders = async () => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findByDateRange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        toDate: selectedEndDate,
        fromDate: selectedStartDate
        // fromDate: new Date(Date.parse(selectedStartDate) - 604800000)
      })
    }).then(resp => resp.json())
      .then((res) => {
        console.log(res)
        let values = []
        // for (let key in res) {
        //   values.push(res[key])
        // }
        res.map((ele) => {
          values.push(ele.value)
        })
        providerValue = values
        console.log(providerValue)
        setValueInChart();
      })
  }

  const setValueInChart = () => {
    console.log(usersValue, providerValue)
    let chartVal = [
      {
        name: "Users",
        data: usersValue,
        color: "#4318FF",
      },
      {
        name: "Providers",
        data: providerValue,
        color: "#6AD2FF",
      },
    ];
    let chartOpt = {
      legend: {
        show: false,
      },

      theme: {
        mode: "light",
      },
      chart: {
        type: "line",

        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
          backgroundColor: "#000000"
        },
        theme: 'dark',
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#A3AED0",
            fontSize: "12px",
            fontWeight: "500",
          },
        },
        type: "text",
        range: undefined,
        categories: userProviderOptions,
      },

      yaxis: [
        {
          title: {
            text: "Users",
            style: {
              color: "#4318FF"
            }
          }
        },
        {
          opposite: true,
          title: {
            text: "Providers",
            style: {
              color: "#6AD2FF"
            }
          }
        }
      ],
    };
    setchartOptions(chartOpt)
    setchartValue(chartVal)
  }

  // const onStartDateChange = (data) => {
  //   setSelectedStartDate(data)
  //   startDateChanged(data)
  // }

  // const handleStartDateChange = (date) => {
  //   setSelectedStartDate(date);
  //   onGettingStartDate(date);
  //   if (selectedEndDate && date > selectedEndDate) {
  //     setSelectedEndDate(date);
  //     onGettingEndDate(date);
  //   }
  // };

  // const handleEndDateChange = (date) => {
  //   setSelectedEndDate(date);
  //   onGettingEndDate(date);
  //   if (selectedStartDate && date < selectedStartDate) {
  //     setSelectedStartDate(date);
  //     onGettingStartDate(date);
  //   }
  // };

  // const selectedEndDateMinusSixDays = selectedStartDate
  //   ? new Date(selectedStartDate.getTime() - 6 * 24 * 60 * 60 * 1000)
  //   : null;

  return (
    <Card extra="!p-[20px] text-center h-96">
      {/* <div className="flex flex-row justify-between align-centre">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <Dropdown
            button={
              <>
                <MdOutlineCalendarToday />
                <span className="ml-1 text-sm font-medium text-gray-600">{selectedStartDate ? selectedStartDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Start date"}</span>
              </>
            }
            animation="origin-[65%_0%] md:origin-top-left transition-all duration-300 ease-in-out"
            children={
              <MiniCalendar onSelect={(date) => onStartDateChange(date)} />
            }
            classNames={"py-2 top-6 -left-[230px] md:-left-[0px] w-max"}
          />
        </button>
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80" disabled>
          <Dropdown
            button={
              <>
                <MdOutlineCalendarToday />
                <span className="ml-1 text-sm font-medium text-gray-600">{selectedEndDate ? selectedEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "End date"}</span>
              </>
            }
            animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
            children={
              <MiniCalendar
                onSelect={(date) => setSelectedEndDate(date)}
              // selectedDate={selectedEndDateMinusSixDays}
              />
            }
            classNames={"py-2 top-6 -left-[230px] md:-left-[260px] w-max"}
          />
        </button>
      </div> */}

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <LineChart
            options={chartOptions}
            series={chartValue}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
