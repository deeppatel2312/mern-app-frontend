import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline, MdPictureAsPdf } from "react-icons/md";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';

const JobIndex = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [jobTableList, setJobTableList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [inputPageNumber, setInputPageNumber] = useState(pageNumber);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [showHideDeleteBox, setShowHideDeleteBox] = useState(false)
    const [showHideAlertBox, setShowHideAlertBox] = useState(false)
    const [jobStatus, setJobStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    const jobStatusText = {
        "ON": "Ongoing",
        "UP": "Upcoming",
        "CO": "Completed",
        "CN": "Cancelled"
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getAlljob(jobStatus);
    }, [pageSize, pageNumber, sortField, sortOrder]);

    useEffect(() => {
        let debounce;
        debounce = setTimeout(() => {
            setPageNumber(1)
            getAlljob(jobStatus);
        }, 500);
        return () => clearTimeout(debounce)
    }, [search]);

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

    const showDeleteBox = (id) => {
        setShowHideDeleteBox(id)
    }

    const showAlertBox = () => {
        setShowHideAlertBox()
    }

    const deleteItem = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/deleteJobById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: showHideDeleteBox
            })
        })
            .then(resp => resp.json())
            .then(() => {
                setIsLoading(false);
                setShowHideDeleteBox(false)
                getAlljob(jobStatus)
            })
    }

    const handleCreateNew = () => {
        navigate("/job/create");
    }

    const getJobsStatusData = (data) => {
        setJobStatus(data)
        getAlljob(data)
    }

    const getPaymentStatusData = (data) => {
        setPaymentStatus(data)
        getAlljobPayment(data)
    }

    const getAlljob = async (jobStatus) => {
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findAllJobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fromDate: new Date(),
                toDate: new Date(Date.parse(new Date()) + 604800000),
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                search,
                jobStatus
            })
        }).then(resp => resp.json())
            .then((result) => {
                setJobTableList(result.jobs);
                // jobTableList = result.jobs
                setTotalPages(Math.ceil(result.count / pageSize))
            })
    }

    const generateInvoice = async (jobId) => {
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/job/generateInvoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId: jobId })
        })
            .then(resp => resp.json())
            .then((res) => {
                if (res.status && res.invoicePath) {
                    window.open(process.env.REACT_APP_API_URL + '/' + res.invoicePath, '_blank').focus();
                } else {
                    setShowHideAlertBox(true);
                }
            })
    }

    const getAlljobPayment = async (paymentStatus) => {
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findAllJobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fromDate: new Date(),
                toDate: new Date(Date.parse(new Date()) + 604800000),
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                search,
                paymentStatus
            })
        }).then(resp => resp.json())
            .then((result) => {
                setJobTableList(result.jobs);
                // jobTableList = result.jobs
                setTotalPages(Math.ceil(result.count / pageSize))
            })
    }

    const isLastPage = pageNumber === totalPages;

    return (
        <>
            <div className="p-2 my-3 flex bg-white dark:!bg-navy-700">
                <div className="w-1/4">
                    {/* <input type="text" id="search-input" placeholder="Search by name, email, phone" onKeyDown={handleSearchChange} className="input  w-full max-w-xs text-neutral-900 dark:text-white bg-gray-200 dark:!bg-navy-800 placeholder:text-neutral-800 placeholder:dark:text-white" /> */}
                    <input type="text" id="search-input" placeholder="Search by name, email, phone" onChange={(e) => setSearch(e.target.value)} className="input  w-full max-w-xs text-neutral-900 dark:text-white bg-gray-200 dark:!bg-navy-800 placeholder:text-neutral-800 placeholder:dark:text-white" />
                    {/* <button className="btn" onClick={() => window.my_modal_2.showModal()}>open modal</button> */}
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
                    <label className="label text-neutral-900 dark:text-white">Users per page</label>
                    <select className="select w-24 bg-gray-200 dark:!bg-navy-800 text-neutral-900 dark:text-white" aria-label="Default select example" value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
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
                <div className="ml-6">
                    <button className="btn border-none text-blue-500 bg-gray-200 dark:bg-brand-400 dark:text-white" onClick={handleCreateNew}>
                        Create New
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> */}
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto h-[600px] shadow-lg rounded-lg">
                <table className="table table-md">
                    <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
                        <tr className="text-md">
                            <th>#</th>
                            <th>
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Order ID/Reference ID">
                                    Job ID
                                </span>
                            </th>
                            <th>User Name</th>
                            <th>Provider Name</th>
                            <th className="cursor-pointer text-center w-[150px]">
                                <select name="jobStatus" id="jobStatus" className="h-12 items-center justify-center rounded-xl bg-white/0 p-3 text-sm outline-none" onChange={e => getJobsStatusData(e.target.value)}>
                                    <option value="">Job Status</option>
                                    <option value="ON">Ongoing</option>
                                    <option value="UP">Upcoming</option>
                                    <option value="CO">Completed</option>
                                    <option value="CN">Cancelled</option>
                                </select>
                            </th>
                            <th className="cursor-pointer text-center w-[150px]">
                                <select name="paymentStatus" id="paymentStatus" className="h-12 items-center justify-center rounded-xl bg-white/0 p-3 text-sm outline-none" onChange={e => getPaymentStatusData(e.target.value)}>
                                    <option value="">Payment</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </th>
                            <th>Service Name</th>
                            <th>Price</th>
                            {/* <th>Created date</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobTableList.map((ele, index) => (
                            <tr key={ele._id} className="border-b border-gray-400 text-neutral-900 bg-white text-black dark:bg-navy-800 dark:text-white">
                                <th>{(pageNumber - 1) * pageSize + index + 1}</th>
                                <td>{ele.jobId}</td>
                                <td>{ele.userId.firstName} {ele.userId.lastName}</td>
                                <td>{ele.providerId?.firstName} {ele.providerId?.lastName}</td>
                                <td className="text-center">{jobStatusText[ele.jobStatus]}</td>
                                <td className="text-center">{ele.paymentStatus.charAt(0).toUpperCase() + ele.paymentStatus.slice(1)}</td>
                                <td>{ele.serviceId?.name}</td>
                                <td className="text-center">${ele.finalPrice ? ele.finalPrice.toFixed(2) : '0.00'}</td>
                                <td className="flex justify-left">
                                    <Link to={`/job/edit?id=${ele._id}`}><MdOutlineEdit className="ml-1 h-4 w-10" /></Link>
                                    <MdDeleteOutline className="ml-1 h-4 w-10 cursor-pointer" onClick={() => showDeleteBox(ele._id)} />
                                    {ele.paymentStatus === 'completed' &&
                                        <span className="tooltip tooltip-top" data-tip="View invoice">
                                            <MdPictureAsPdf className="ml-1 h-4 w-10 cursor-pointer" onClick={() => generateInvoice(ele._id)} />
                                        </span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="sticky bottom-0  bg-white dark:!bg-navy-800">
                        <tr>
                            <td colSpan={10} className="text-center">
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
            </div>
            {showHideDeleteBox &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                            Are you sure
                        </h4>
                        <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                            Do you want to delete?
                        </h4>
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={deleteItem}>Yes</button>
                            <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => setShowHideDeleteBox(false)}>No</button>
                        </div>
                    </div>
                </div>
            }
            {showHideAlertBox &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50 z-40">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h3 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                            Malformed data
                        </h3>
                        <h2 className="mb-2.5 text-lg font-bold text-center text-navy-700 dark:text-white">
                            Invoice not found
                        </h2>
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="mr-5 bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => setShowHideAlertBox(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default JobIndex;