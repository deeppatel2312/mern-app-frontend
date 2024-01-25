import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { AiOutlinePlusCircle } from "react-icons/ai";

const ServiceIndex = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [services, setServices] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [inputPageNumber, setInputPageNumber] = useState(pageNumber);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasData, setHasData] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [showHideDeleteBox, setShowHideDeleteBox] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        loadServices();
    }, [pageSize, pageNumber, sortField, sortOrder]);

    useEffect(() => {
        let debounce;
        debounce = setTimeout(() => {
            setPageNumber(1)
            loadServices();
        }, 500);
        return () => clearTimeout(debounce)
    }, [search]);

    const loadServices = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/service/findAll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pageNumber,
                pageSize,
                sortField,
                sortOrder,
                search
            })
        }).then(resp => resp.json())
            .then((res) => {
                // let parentList = []
                // res.services.map((ele) => {
                //     if (!ele.parent) {
                //         parentList.push(ele)
                //     }
                // })
                // // console.log(parentList)
                // parentList.map((ele) => {
                //     ele["children"] = []
                //     return res.services.map((ele2) => {
                //         if (ele._id == ele2.parent) {
                //             return ele.children.push(ele2)
                //         }
                //     })
                // })
                // console.log(parentList)
                // setServices(parentList);
                console.log(res.services, res.count)
                setServices(res.services);
                setIsLoading(false);
                setHasData(res.length > 0);
                // setTotalPages(Math.ceil(parentList.length / pageSize));
                setTotalPages(Math.ceil(res.count / pageSize));
                if (res.length === 0 && !hasData) {
                    console.log('has no data')
                    window.my_modal_2.showModal()
                }
            });

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

    const showDeleteBox = (ele) => {
        console.log(ele)
        if (ele.children) {
            setShowHideDeleteBox({ _id: ele._id, children: ele.children })
        } else {
            setShowHideDeleteBox({ _id: ele._id, children: [] })
        }
    }

    const deleteItem = async () => {
        // console.log(showHideDeleteBox)
        let deleteItem = [showHideDeleteBox._id]

        if(showHideDeleteBox.children.length > 0) {
            showHideDeleteBox.children.map((ele) => {
                deleteItem.push(ele._id)
            })
        }
        console.log(deleteItem)

        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/service/deleteById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(deleteItem)
        })
            .then(resp => resp.json())
            .then(() => {
                setShowHideDeleteBox(false)
                setTimeout(() => {
                    setIsLoading(false);
                    loadServices()
                }, 1000);
            })
    }

    const handleCreateNew = () => {
        navigate("/service/create");
    }

    const opeHideChildren = (id) => {
        $(`.${id}`).toggleClass('show')
    }

    // Child Hide-Show Start
    // $('.parent').on('click', function () {
    //     var target = $(this).attr('id');
    //     $('.children.' + target).toggleClass('show')
    //     // alert('children' + target);
    // });
    $('.parent').on('click', function () {
        $(this).toggleClass('show');
    });

    const isLastPage = pageNumber === totalPages;

    return (
        <>
            <div className="p-2 my-3 flex bg-white dark:!bg-navy-700">
                <div className="w-1/4">
                    {/* <input type="text" id="search-input" placeholder="Search by service name" onKeyDown={handleSearchChange} className="input  w-full max-w-xs bg-gray-200 dark:!bg-navy-800 text-neutral-900 dark:text-white placeholder:text-neutral-800 placeholder:dark:text-white" /> */}
                    <input type="text" id="search-input" placeholder="Search by service name" onChange={(e) => setSearch(e.target.value)} className="input  w-full max-w-xs bg-gray-200 dark:!bg-navy-800 text-neutral-900 dark:text-white placeholder:text-neutral-800 placeholder:dark:text-white" />
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
                    <label className="label text-neutral-900 dark:text-white">Services per page</label>
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
                <div className="ml-6">
                    <button className="btn border-none text-blue-500 bg-gray-200 dark:bg-brand-400 dark:text-white" onClick={handleCreateNew}>
                        Create New
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> */}
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto h-[600px] shadow-lg rounded-lg">
                <table className="table table-md service-table">
                    <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
                        <tr className="text-md">
                            <th>#</th>
                            <th onClick={() => handleSortClick('name')} className="cursor-pointer">
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Click to sort by name">
                                    <FaSort className="h-4 w-4" />
                                    Name
                                </span>
                            </th>
                            <th onClick={() => handleSortClick('description')} className="cursor-pointer">
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Click to sort by description">
                                    <FaSort className="h-4 w-4" />
                                    Description
                                </span>
                            </th>
                            <th onClick={() => handleSortClick('status')} className="cursor-pointer text-center">
                                <span className="tooltip tooltip-bottom flex flex-row" data-tip="Click to sort by status">
                                    <FaSort className="h-4 w-4" />
                                    Status
                                </span>
                            </th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => (
                            <>
                                <tr id={service._id} key={service._id} className={`parent border-b border-gray-400 bg-white text-black text-neutral-900  dark:bg-navy-800 dark:text-white ${service.children.length > 0 ? "cursor-pointer" : "default"} ${service.children.length > 0 ? "has-child" : ""}`} onClick={() => opeHideChildren(service._id)}>
                                    <th>{(pageNumber - 1) * pageSize + index + 1}</th>
                                    <td>{service.name}</td>
                                    <td>{service.description}</td>
                                    <td>{service.isActive ? (
                                        <span className="">{`Active`}</span>
                                    ) : (
                                        <span className="badge badge-outline">{`Inactive`}</span>
                                    )}</td>
                                    <td className="flex justify-around">
                                        <Link to={`/service/create?parentId=${service._id}`}><AiOutlinePlusCircle className="ml-1 h-4 w-4" /></Link>
                                        <Link to={`/service/edit?id=${service._id}`}><MdOutlineEdit className="ml-1 h-4 w-4" /></Link>
                                        {/* <Link to={`/service/delete?id=${service._id}`}><MdDeleteOutline className="ml-1 h-4 w-4" /></Link> */}
                                        <MdDeleteOutline className="ml-1 h-4 w-4" onClick={() => showDeleteBox(service)} />
                                    </td>
                                </tr>
                                {
                                    service.children.length > 0 && service.children.map((ele, index2) => (
                                        <tr className={`children ${service._id} text-neutral-900 dark:text-white`}>
                                            <td>{(pageNumber - 1) * pageSize + index + 1} - {index2 + 1}</td>
                                            <td>{ele.name}</td>
                                            <td>{ele.description}</td>
                                            <td>{ele.isActive ? (
                                                <span className="">{`Active`}</span>
                                            ) : (
                                                <span className="badge badge-outline">{`Inactive`}</span>
                                            )}</td>
                                            <td className="flex justify-around">
                                                <Link to={`/service/edit?id=${ele._id}`}><MdOutlineEdit className="ml-1 h-4 w-4" /></Link>
                                                <MdDeleteOutline className="ml-1 h-4 w-4" onClick={() => showDeleteBox(ele)} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </>
                        ))}
                    </tbody>
                    <tfoot className="sticky bottom-0  bg-white dark:!bg-navy-800">
                        <tr>
                            <td colSpan={16} className="text-center">
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
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] p-8 rounded-[8px] block bg-white dark:bg-navy-800">
                        <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                            Are you sure
                        </h4>
                        <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                            Do you want to delete?
                        </h4>
                        {
                            showHideDeleteBox.children.length > 0 &&
                            <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                                It has {showHideDeleteBox.children.length} sub category.
                            </h4>
                        }
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="mr-5 w-20 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={deleteItem}>Yes</button>
                            <button className="bg-red-500 w-20 hover:bg-red-600 text-white p-2 rounded" onClick={() => setShowHideDeleteBox(false)}>No</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ServiceIndex;