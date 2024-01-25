import React, { useMemo, useState, useEffect } from "react";

const DataTable = (props) => {
  let [users, setUsers] = useState([]);
  let [jobsOngoing, setJobsOngoing] = useState([]);
  let [jobsUpcoming, setJobsUpcoming] = useState([]);
  let [jobsComplete, setJobsComplete] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findAll`).then(resp => resp.json());
      setUsers(results);
    }

    loadUsers();
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      let results = await fetch(`${process.env.REACT_APP_API_URL}/api/job/findAll`).then(resp => resp.json());
      let jobStatus = {
        Ongoing: [],
        Upcoming: [],
        Complete: [],
      };

      results.forEach(job => {
        jobStatus[job.status].push(job);
      });

      setJobsOngoing(jobStatus.Ongoing);
      setJobsUpcoming(jobStatus.Upcoming);
      setJobsComplete(jobStatus.Complete);
    }

    loadJobs();
  }, []);

  // make different color classes for each status: Queued, Running, Stopped, Completed, Pending, Failed
  const statusClasses = useMemo(() => ({
    Queued: 'bg-yellow-500',
    Running: 'bg-blue-500',
    Stopped: 'bg-gray-500',
    Completed: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Failed: 'bg-red-500',
  }), []);

  // the whole pagination thing
  const [currentPageOngoing, setCurrentPageOngoing] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const indexOfLastItemOngoing = currentPageOngoing * itemsPerPage;
  const indexOfFirstItemOngoing = indexOfLastItemOngoing - itemsPerPage;
  const currentItemsOngoing = jobsOngoing.slice(indexOfFirstItemOngoing, indexOfLastItemOngoing);
  // const currentItemsUpcoming = jobsUpcoming.slice(indexOfFirstItem, indexOfLastItem);
  // const currentItemsComplete = jobsComplete.slice(indexOfFirstItem, indexOfLastItem);

  const totalPagesOngoing = Math.ceil(jobsOngoing.length / itemsPerPage);
  const totalPagesUpcoming = Math.ceil(jobsUpcoming.length / itemsPerPage);
  const totalPagesComplete = Math.ceil(jobsComplete.length / itemsPerPage);

  const handleNextPageOngoing = () => {
    if (currentPageOngoing < totalPagesOngoing) {
      setCurrentPageOngoing(currentPageOngoing + 1);
    }
  };
  const handlePrevPageOngoing = () => {
    if (currentPageOngoing > 1) {
      setCurrentPageOngoing(currentPageOngoing - 1);
    }
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 my-6">Ongoing Jobs</h1>
            <table className="w-full sm:overflow-auto px-6 border border-gray-300 text-center">
              <tr className="py-12 border-b border-gray-300 bg-brand-300 text-white">
                <th className="pt-[14px] pb-[16px]">#</th>
                <th className="border-l border-gray-300">Product</th>
                <th className="border-l border-gray-300">Price</th>
                <th className="border-l border-gray-300">Provider</th>
                {/* <th className="border-l border-gray-300">Status</th> */}
                {/* <th className="border-l border-gray-300">Created</th> */}
              </tr>
              {currentItemsOngoing.map((job, index) => (
                <tr className="border-b border-gray-300">
                  <td className="pt-[14px] pb-[14px] sm:text-[14px]">{index + 1}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.productId}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{`$ ${job.price}`}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.providerId}</td>
                  {/* <td className={`pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300 ${statusClasses[job.status]}`}>{job.status}</td> */}
                  {/* <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{job.status}</td>
                <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{new Date(job.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}</td> */}
                </tr>
              ))}
            </table>
            <div className="flex justify-between w-full">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-1 px-4"
                onClick={handlePrevPageOngoing}
              >
                &lt; Page 3 of 10
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-1 px-4"
                onClick={handleNextPageOngoing}
              >
                Next
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 my-6">Upcoming Jobs</h1>
            <table className="w-full sm:overflow-auto px-6 border border-gray-300 text-center">
              <tr className="py-12 border-b border-gray-300 bg-brand-300 text-white">
                <th className="pt-[14px] pb-[16px]">#</th>
                <th className="border-l border-gray-300">Product</th>
                <th className="border-l border-gray-300">Price</th>
                <th className="border-l border-gray-300">Provider</th>
                {/* <th className="border-l border-gray-300">Status</th> */}
                {/* <th className="border-l border-gray-300">Created</th> */}
              </tr>
              {jobsUpcoming.map((job, index) => (
                <tr className="border-b border-gray-300">
                  <td className="pt-[14px] pb-[14px] sm:text-[14px]">{index + 1}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.productId}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{`$ ${job.price}`}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.providerId}</td>
                  {/* <td className={`pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300 ${statusClasses[job.status]}`}>{job.status}</td> */}
                  {/* <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{job.status}</td>
                <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{new Date(job.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}</td> */}
                </tr>
              ))}
            </table>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 my-6">Completed Jobs</h1>
            <table className="w-full sm:overflow-auto px-6 border border-gray-300 text-center">
              <tr className="py-12 border-b border-gray-300 bg-brand-300 text-white">
                <th className="pt-[14px] pb-[16px]">#</th>
                <th className="border-l border-gray-300">Product</th>
                <th className="border-l border-gray-300">Price</th>
                <th className="border-l border-gray-300">Provider</th>
                {/* <th className="border-l border-gray-300">Status</th> */}
                {/* <th className="border-l border-gray-300">Created</th> */}
              </tr>
              {jobsComplete.map((job, index) => (
                <tr className="border-b border-gray-300">
                  <td className="pt-[14px] pb-[14px] sm:text-[14px]">{index + 1}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.productId}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{`$ ${job.price}`}</td>
                  <td className="pt-[14px] pb-[14px] sm:text-[14px] border-l border-gray-300">{job.providerId}</td>
                  {/* <td className={`pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300 ${statusClasses[job.status]}`}>{job.status}</td> */}
                  {/* <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{job.status}</td>
                <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{new Date(job.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}</td> */}
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 my-6">Users</h1>
        <table className="w-full sm:overflow-auto px-6 my-6 border border-gray-300 text-center">
          <tr className="py-12 border-b border-gray-300 bg-brand-300 text-white">
            <th className="pt-[14px] pb-[16px]">#</th>
            <th className="border-l border-gray-300">Name</th>
            <th className="border-l border-gray-300">Email</th>
            <th className="border-l border-gray-300">Created At</th>
          </tr>
          {users.map((user, index) => (
            <tr className="border-b border-gray-300">
              <td className="pt-[14px] pb-[16px] sm:text-[14px]">{index + 1}</td>
              <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{user.name}</td>
              <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{user.email}</td>
              <td className="pt-[14px] pb-[16px] sm:text-[14px] pl-3 border-l border-gray-300">{new Date(user.createdAt).toLocaleDateString('en-US')}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
};

export default DataTable;
