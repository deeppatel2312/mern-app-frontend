import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import { MdDashboard, MdPerson, MdDoneOutline, MdSchedule, MdPublishedWithChanges, MdOutlinePersonPin } from "react-icons/md";
import React, { useState, useEffect } from "react";
import Widget from "components/widget/Widget";
import { useNavigate } from "react-router-dom";
import WeeklyReportBarChart from "./components/WeeklyReportBarChart";
import MiniCalendar from "components/calendar/MiniCalendar";
import {
  MdOutlineCalendarToday,
} from "react-icons/md";
import Dropdown from "components/dropdown";

const Dashboard = () => {
  // let [startDate, setStartDate] = useState({});
  // let [endDate, setEndDate] = useState({});

  const navigate = useNavigate();
  if (localStorage.getItem("LuminixLoginToken") === null) {
    navigate("/auth");
  }

  const [userCounts, setUserCounts] = useState([]);
  const [counts, setCounts] = useState([]);
  const [jobsListTable, setJobsListTable] = useState([]);
  const [jobStatuses, setJobStatuses] = useState([]);
  const [totalUserReg, setTotalUserReg] = useState([]);
  const [lastWeekUserReg, setLastWeekUserReg] = useState([]);
  const [totalProviderReg, setTotalProviderReg] = useState([]);
  const [revenuePrice, setRevenuePrice] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [ongoingJobs, setOngoingJobs] = useState(0);
  const [upcompingJobs, setUpcompingJobs] = useState(0);
  // const [date, setDate] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inputPageNumber, setInputPageNumber] = useState(pageNumber);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [search, setSearch] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(Date.parse(new Date()) - 604800000));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  var jobTableList = []
  useEffect(() => {
    // const loadCounts = async () => {
    //   let results = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/getCounts`).then(resp => resp.json());
    //   setCounts(results);
    // }
    // const loadJobStatuses = async () => {
    //   let results = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/getJobStatuses`).then(resp => resp.json());
    //   setJobStatuses(results);
    // }
    getjob(new Date())
    lastWeekUserRegFun(new Date())
    getAlljob(selectedStartDate, jobStatus)

    // loadCounts();
    // loadJobStatuses();
    countUser()
    countProvider()
  }, []);

  const handleDateRangeChange = (start, end) => {
    const days = (end - start) / (1000 * 60 * 60 * 24);

    // console.log('difference is ', days)

    if (5 < days && days < 7) {
      // console.log('sending start date is ', start);
      // console.log('sending end date is ', end);

      const istOffset = parseInt(process.env.REACT_APP_IST_OFFSET); // IST offset is 5 hours and 30 minutes ahead of UTC
      const istStart = new Date(start.getTime() + (istOffset * 60000));
      const istEnd = new Date(end.getTime() + (istOffset * 60000));

      const getUserCounts = async () => {
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findByDateRange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromDate: istStart,
            toDate: istEnd
          })
        }).then(resp => resp.json());
        // convert results object to array
        let resultsArray = [];
        for (let key in results) {
          resultsArray.push({ weekDay: key, count: results[key] });
        }
        // console.log('results array ', resultsArray);
        setUserCounts(resultsArray);
      }
      getUserCounts();
    }
  };

  useEffect(() => {
    handleDateRangeChange(selectedStartDate, selectedEndDate);
  }, [selectedStartDate, selectedEndDate]);

  var timeout;
  const startDateChangedNow = (data) => {
    // console.log("Above timeout",data)
    // if (timeout) {
    //   // console.log("inside timeout", data)
    //   return;
    // }
    // // console.log("After timeout",data)
    // timeout = setTimeout(() => {
    //   setDate(data)
    //   // getUsers(data)
    //   // getProviders(data)
    //   timeout = null
    // }, 2500);
  }

  const lastWeekUserRegFun = async (data) => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findByDateRange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        toDate: data,
        fromDate: new Date(Date.parse(data) - 604800000).toISOString()
      })
    }).then(resp => resp.json())
      .then((res) => {
        let values = 0
        // for (let key in res) {
        //   values += res[key]
        // }
        res.map((ele) => {
          values += ele.value
        })
        setLastWeekUserReg(() => values)
      })
  }

  const getjob = async (data) => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/job/findByDateRange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fromDate: data,
        toDate: new Date(Date.parse(data) + 604800000)
      })
    }).then(resp => resp.json())
      .then((res) => {
        let values = 0
        let cojob = 0
        let upjob = 0
        let onjob = 0
        res.map((ele) => {
          // if (new Date(ele.createdAt) >= new Date(data) && new Date(ele.createdAt) <= new Date(Date.parse(data) + 604800000)) {
          if (ele.jobStatus == 'CO') {
            values += ele.finalPrice ? ele.finalPrice : 0
            cojob++
          } else if (ele.jobStatus == 'ON') {
            onjob++
          } else if (ele.jobStatus == 'UP') {
            upjob++
          }
          // }
        })
        setRevenuePrice(values ? values.toFixed(2) : 0)
        setCompletedJobs(cojob)
        setOngoingJobs(onjob)
        setUpcompingJobs(upjob)
      })
  }

  const countUser = () => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findAllUser`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(resp => resp.json())
      .then((res) => {
        setTotalUserReg(res)
      })
  }
  const countProvider = () => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findAllProvider`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(resp => resp.json())
      .then((res) => {
        setTotalProviderReg(res)
      })
  }

  useEffect(() => {
    let debounce;
    debounce = setTimeout(() => {
      setPageNumber(1)
      getAlljob(selectedStartDate, jobStatus);
    }, 500);
    return () => clearTimeout(debounce)
  }, [search])

  const getAlljob = async (date, jobStatus) => {
    const token = localStorage.getItem('LuminixLoginToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/job/findAll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fromDate: date,
        toDate: new Date(Date.parse(date) + 604800000),
        pageNumber,
        pageSize,
        sortField,
        sortOrder,
        search,
        jobStatus
      })
    }).then(resp => resp.json())
      .then((result) => {
        // console.log(result)
        setJobsListTable(result.jobs);
        jobTableList = result.jobs
        setTotalPages(Math.ceil(result.count / pageSize))
      })
  }

  const handleNextPage = () => {
    setPageNumber(pageNumber + 1);
  };
  const handlePreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };
  const handlePageNumberClick = (page) => {
    setPageNumber(page);
  };
  const handleInputPageNumberChange = (event) => {
    setInputPageNumber(event.target.value);
  };
  const handleInputPageNumberKeyDown = (event) => {
    if (event.key === 'Enter') {
      let newPageNumber = parseInt(inputPageNumber);
      if (newPageNumber > totalPages) {
        newPageNumber = totalPages;
      }
      setPageNumber(newPageNumber);
      setInputPageNumber(newPageNumber);
    }
  }
  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  const handleSearchChange = (event) => {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      setPageNumber(1)
    }
  }
  const handleResetFilter = () => {
    setSearch('');
    setSortField('createdAt');
    setSortOrder('desc');
    setPageNumber(1);
    setInputPageNumber(1);
    setPageSize(10)
    setJobStatus("")
    getAlljob(selectedStartDate, '')
    document.getElementById('search-input').value = '';
  };

  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push({ value: i, disabled: false });
    }
  } else {
    if (pageNumber <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push({ value: i, disabled: false });
      }
      pageNumbers.push({ value: '...', disabled: true });
      pageNumbers.push({ value: totalPages, disabled: false });
    } else if (pageNumber >= totalPages - 2) {
      pageNumbers.push({ value: 1, disabled: false });
      pageNumbers.push({ value: '...', disabled: true });
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push({ value: i, disabled: false });
      }
    } else {
      pageNumbers.push({ value: 1, disabled: false });
      pageNumbers.push({ value: '...', disabled: true });
      for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
        pageNumbers.push({ value: i, disabled: false });
      }
      pageNumbers.push({ value: '...', disabled: true });
      pageNumbers.push({ value: totalPages, disabled: false });
    }
  }

  const isLastPage = pageNumber === totalPages;

  const getJobsStatusData = (data) => {
    setJobStatus(data)
    getAlljob(selectedStartDate, data)
  }

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6" style={{ zIndex: "-1" }}>
        <Widget
          icon={<MdPerson className="h-7 w-7" />}
          title={"Users"}
          // subtitle={counts.users}
          subtitle={totalUserReg}
        />
        <Widget
          icon={<MdOutlinePersonPin className="h-7 w-7" />}
          title={"Providers"}
          // subtitle={counts.users}
          subtitle={totalProviderReg}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Revenue"}
          subtitle={`$ ${revenuePrice}`}
        />
        <Widget
          icon={<MdPublishedWithChanges className="h-7 w-7" />}
          title={"Ongoing Jobs"}
          subtitle={ongoingJobs}
        />
        <Widget
          icon={<MdSchedule className="h-7 w-7" />}
          title={"Upcoming Jobs"}
          subtitle={upcompingJobs}
        />
        <Widget
          icon={<MdDoneOutline className="h-7 w-7" />}
          title={"Completed Jobs"}
          subtitle={completedJobs}
        />
        <Widget
          icon={<MdPerson className="h-7 w-7" />}
          title={"Users last week"}
          subtitle={lastWeekUserReg}
        />
      </div>

      <div className="mt-3 flex flex-row align-centre bg-white rounded-xl p-3">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <Dropdown
            button={
              <>
                <MdOutlineCalendarToday />
                <span className="ml-1 text-sm font-medium text-gray-600">{selectedStartDate ? selectedStartDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Start date"}</span>
              </>
            }
            animation="md:origin-top-left transition-all duration-300 ease-in-out"
            children={
              <MiniCalendar onSelect={(date) => setSelectedStartDate(date)} selectedDate={selectedStartDate} />
            }
            classNames={"py-2 w-max"}
          />
        </button>
        <button className="linear mt-1 ml-64 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <Dropdown
            button={
              <>
                <MdOutlineCalendarToday />
                <span className="ml-1 text-sm font-medium text-gray-600">{selectedEndDate ? selectedEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Start date"}</span>
              </>
            }
            animation="md:origin-top-left transition-all duration-300 ease-in-out"
            children={
              <MiniCalendar onSelect={(date) => setSelectedEndDate(date)} />
            }
            classNames={"py-2 w-max"}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* <TotalSpent userLineChartData={userCounts} startDateChanged={(data) => startDateChangedNow(data)} /> */}
            <TotalSpent userLineChartData={userCounts} selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} />
            {/* <WeeklyRevenue date={date} /> */}
            <WeeklyReportBarChart selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <div className="w-1/4 grid grid-cols-1 rounded-[20px]">
        </div>
      </div>

      {/* <div className="flex p-2 my-3 bg-white dark:!bg-navy-700">
        <div className="w-1/4">
          <input type="text" id="search-input" placeholder="Search by name, email, phone" onChange={(e) => setSearch(e.target.value)} className="input  w-full max-w-xs bg-gray-200 dark:!bg-navy-800 text-neutral-900 dark:text-white placeholder:text-neutral-800 placeholder:dark:text-white" />
          <dialog id="my_modal_2" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg">No data found!</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
        <div className="flex justify-between w-60 ml-6">
          <label className="label text-neutral-900 dark:text-white">Jobs per page</label>
          <select className="select w-24  bg-gray-200 dark:!bg-navy-800 text-neutral-900 dark:text-white" aria-label="Default select example" value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="ml-6">
          <button className="btn border-none text-blue-500 bg-gray-200 dark:bg-brand-400 dark:text-white" onClick={handleResetFilter}>
            Reset
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto h-[auto] shadow-lg rounded-lg">
        <table className="table table-md">
          <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
            <tr className="text-md">
              <th>#</th>
              <th className="cursor-pointer">
                Name
              </th>
              <th>Phone</th>
              <th className="cursor-pointer">
                Email
              </th>
              <th className="cursor-pointer text-center">
                <select name="jobStatus" id="jobStatus" className="h-12 items-center justify-center rounded-xl bg-white/0 p-3 text-sm outline-none" onChange={e => getJobsStatusData(e.target.value)}>
                  <option value="">Status</option>
                  <option value="ON">Ongoing</option>
                  <option value="UP">Upcoming</option>
                  <option value="CO">Completed</option>
                </select>
              </th>
              <th>Service Name</th>
              <th>Provider Name</th>
              <th>
                Created date
              </th>
            </tr>
          </thead>
          <tbody>
            {jobsListTable.map((ele, index) => (
              <tr key={ele._id} className="border-b border-gray-400 bg-white text-black dark:bg-navy-800 text-neutral-900 dark:text-white">
                <th>{(pageNumber - 1) * pageSize + index + 1}</th>
                <td>{ele.userId.firstName} {ele.userId.lastName}</td>
                <td>{ele.userId.phone}</td>
                <td>{ele.userId.email}</td>
                <td className="text-center">{ele.jobStatus === "CO" ? "Completed" : ele.jobStatus === "ON" ? "Ongoing" : "Upcoming"}</td>
                <td>{ele.serviceId?.name}</td>
                <td>{ele.providerId?.firstName} {ele.providerId?.lastName}</td>
                <td>{(new Date(ele.createdAt)).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 bg-white dark:!bg-navy-800">
            <tr>
              <td colSpan={20} className="text-center">
                <div className="flex justify-between">
                  <button className="join-item btn btn-outline text-neutral-900 dark:text-white" onClick={handlePreviousPage} disabled={pageNumber === 1}>Previous Page</button>
                  <div className="flex w-1/3">
                    {pageNumbers.map((page, index) => (
                      <button key={index} className={`btn border-none mr-2 join-item ${pageNumber === page.value ? 'bg-gray-300 dark:!bg-navy-900 text-neutral-900 dark:text-white' : ''}`} onClick={() => !page.disabled && handlePageNumberClick(page.value)} disabled={page.disabled}>{page.value}</button>
                    ))}
                    <div className="tooltip tooltip-top" data-tip="Go to page">
                      <input type="number" className="input w-24 bg-gray-200 dark:!bg-navy-900 text-neutral-900 dark:text-white" value={inputPageNumber} onChange={handleInputPageNumberChange} onKeyDown={handleInputPageNumberKeyDown} />
                    </div>
                  </div>
                  <button className="join-item btn btn-outline text-neutral-900 dark:text-white" onClick={handleNextPage} disabled={isLastPage}>Next Page</button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div> */}

    </div>
  );
};

export default Dashboard;
