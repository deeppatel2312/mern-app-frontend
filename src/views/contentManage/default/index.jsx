import React, { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';

const ContentManageIndex = () => {
    const navigate = useNavigate();

    const [allRecords, setAllRecords] = useState([]);

    useEffect(() => {
        getAllRecord()
    }, [])

    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }

    const getAllRecord = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getAllContent`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((res) => {
                setAllRecords(res)
            })
    }

    return (
        <>
            <div className="overflow-x-auto h-[600px] shadow-lg rounded-lg">
                <table className="table table-md">
                    <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
                        <tr className="text-md">
                            <th>#</th>
                            <th className="cursor-pointer">
                                Page title
                            </th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allRecords && allRecords.map((ele, i) => {
                                return <>
                                    <tr key={ele._id} className="border-b border-gray-400 text-neutral-900 bg-white text-black dark:bg-navy-800 dark:text-white">
                                        <th>{i + 1}</th>
                                        <td>{ele.title}</td>
                                        <td className="flex justify-around">
                                            <Link to={`/contentManage/edit?id=${ele._id}`}><MdOutlineEdit className="ml-1 h-4 w-4" /></Link>
                                        </td>
                                    </tr>
                                </>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ContentManageIndex;