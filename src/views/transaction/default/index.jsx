import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlinePreview } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import MiniCalendar from "components/calendar/MiniCalendar";
import {
    MdOutlineCalendarToday,
} from "react-icons/md";
import Dropdown from "components/dropdown";

const TransactionIndex = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [dataTableList, setDataTableList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [inputPageNumber, setInputPageNumber] = useState(pageNumber);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [transactionType, setTransactionType] = useState('');
    const [showHideAlertBox, setShowHideAlertBox] = useState(false)
    const [showHideAlertBoxText, setShowHideAlertBoxText] = useState('')
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    useEffect(() => {
        window.scrollTo(0, 0)
        getAllTransactions(transactionType);
    }, [pageSize, pageNumber, sortField, sortOrder]);

    useEffect(() => {
        let debounce;
        debounce = setTimeout(() => {
            setPageNumber(1)
            getAllTransactions(transactionType);
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
        setPageSize(15)
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

    const transactionTypes = {
        'sub': 'Subscription',
        'job': 'Job'
    }

    const getJobsStatusData = (data) => {
        setTransactionType(data)
        getAllTransactions(data)
    }

    const getAllTransactions = async (transactionType) => {
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/transaction/allTransactionsList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                search,
                transactionType,
                sortField,
                sortOrder,
                pageSize,
                pageNumber
            })
        }).then(resp => resp.json())
            .then((result) => {
                setDataTableList(result.transactions);
                setTotalPages(Math.ceil(result.count / pageSize))
            })
    }

    const isLastPage = pageNumber === totalPages;

    const handleReport = () => {
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');

        fetch(`${process.env.REACT_APP_API_URL}/api/transaction/generateReport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                selectedStartDate,
                selectedEndDate,
                transactionType: ['incoming']
            })
        })
            .then(async (result) => {
                const blob = await result.blob();
                const link = document.createElement('a');
                const blobUrl = window.URL.createObjectURL(blob);

                link.href = blobUrl;

                var currentDate = new Date();
                var year = currentDate.getFullYear();
                var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
                var day = ('0' + currentDate.getDate()).slice(-2);

                // Create the file name with the current date
                var fileName = 'transactions_' + year + '_' + month + '_' + day + '.xlsx';

                // Set the download attribute of the link
                link.download = fileName;
                // link.download = 'transactions-export.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                setIsLoading(false);
            })
            .catch((err) => {
                setShowHideAlertBoxText("Something went wrong. Try again.")
                setShowHideAlertBox(true)
                setIsLoading(false);
            })
    }

    return (
        <>
            <div className="p-2 my-3 flex bg-white dark:!bg-navy-700">
                <div className="w-1/6">
                    <input type="text" id="search-input" placeholder="Search by transaction ID" onChange={(e) => setSearch(e.target.value)} className="input  w-full max-w-xs text-neutral-900 dark:text-white bg-gray-200 dark:!bg-navy-800 placeholder:text-neutral-800 placeholder:dark:text-white" />
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
                <div className="flex justify-between w-48 ml-6">
                    <label className="label text-neutral-900 dark:text-white">Records</label>
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
                <div className="ml-6 flex">
                    <button
                        className="btn border-none text-blue-500 bg-gray-200 dark:bg-brand-400 dark:text-white" onClick={handleReport}
                        disabled={isLoading}>
                        {!isLoading ? 'Generate sheet' : 'Loading sheet...'}
                    </button>
                    <button className="border border-gray-300 linear ml-5 mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
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
                    <button className="border border-gray-300 linear ml-5 mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
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
            </div>
            <div className="overflow-x-auto h-[600px] shadow-lg rounded-lg">
                <table className="table table-sm">
                    <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
                        <tr className="text-md">
                            <th>#</th>
                            <th>ID</th>
                            <th onClick={() => handleSortClick('date')} className="cursor-pointer">
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Click to sort by date">
                                    <FaSort className="h-4 w-4" />
                                    Date
                                </span>
                            </th>
                            <th onClick={() => handleSortClick('finalAmount')} className="cursor-pointer">
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Click to sort by amount">
                                    <FaSort className="h-4 w-4" />
                                    Amount
                                </span>
                            </th>
                            <th>Person</th>
                            <th className="cursor-pointer text-center w-[150px]">
                                <select name="transactionType" id="transactionType" className="h-12 items-center justify-center rounded-xl bg-white/0 p-3 text-sm outline-none" onChange={e => getJobsStatusData(e.target.value)}>
                                    <option value="">Transaction Type</option>
                                    <option value="sub">Subscription</option>
                                    <option value="job">Job</option>
                                </select>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataTableList.map((ele, index) => (
                            <tr key={ele._id} className="border-b border-gray-400 text-neutral-900 bg-white text-black dark:bg-navy-800 dark:text-white">
                                <th>{(pageNumber - 1) * pageSize + index + 1}</th>
                                <td>{ele.transactionId}</td>
                                <td>{(new Date(ele.date)).toLocaleString()}</td>
                                <td>${ele.finalAmount}</td>
                                <td>{ele.personId && (ele.personId.firstName + " " + ele.personId.lastName)}</td>
                                <td>{transactionTypes[ele.transactionType]}</td>
                                <td>
                                    <Link to={`/transaction/view?id=${ele._id}`}>
                                        <span className="tooltip tooltip-top" data-tip="View Details">
                                            <MdOutlinePreview className="ml-1 h-4 w-10 cursor-pointer" />
                                        </span>
                                    </Link>
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

            {showHideAlertBox &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50 z-40">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                            {showHideAlertBoxText}
                        </h4>
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={() => setShowHideAlertBox(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default TransactionIndex;