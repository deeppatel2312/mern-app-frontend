import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import DropdownSearch from "components/dropdown/DropdownSearch";
import TextareaField from "components/fields/TextField";

const ReportEdit = () => {
    // get the id from the url which is in form of /job/edit?id=1

    const navigate = useNavigate();
    const [fetchedData, setFetchedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [reportedPerson, setReportedPerson] = useState('');
    const [reportingPerson, setReportingPerson] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [isActive, setIsActive] = useState('');
    const [resolvedAt, setResolvedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    
    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        loadRecord()
    }, []);

    const loadRecord = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getReportById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                _id: id
            })
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setFetchedData(res.data)
                setIsLoading(false);
                let data = res.data
                setReportedPerson(() => data?.reportedPerson?.firstName + " " + data?.reportedPerson?.lastName)
                setReportingPerson(() => data?.reportingPerson?.firstName + " " + data?.reportingPerson?.lastName)
                setReviewId(() => data?.reviewId)
                setStatus(() => data?.status)
                setIsActive(() => data?.isActive)
                setCreatedAt(() => data?.createdAt)
                setDescription(() => data?.description)
            })
    }

    const cancelEdit = () => {
        navigate("/report");
    }

    const  editRecord = async () => {
        let payload = {
            _id : fetchedData._id,
            reportedPerson : fetchedData.reportedPerson._id,
            reportingPerson : fetchedData.reportingPerson._id,
            reviewId,
            status,
            isActive,
            createdAt,
            description
        }
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateReport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                cancelEdit()
            })
    }


    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Update Data
                    </p>
                    {/* <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                        Update Data
                    </h4> */}

                    <div className="flex flex-wrap">

                        {/* Reporting Person */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Reporting Person*"
                            placeholder="Reporting Person"
                            id="reportingPerson"
                            type="text"
                            value={reportingPerson}
                            disabled={true}
                            onChange={(e) => setReportingPerson(e.target.value)}
                        />

                        {/* reportedPerson */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Reported Person*"
                            placeholder="Reported Person"
                            id="reportedPerson"
                            type="text"
                            value={reportedPerson}
                            disabled={true}
                            onChange={(e) => setReportedPerson(e.target.value)}
                        />

                        {/* Review Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Review Id*"
                            placeholder="Review Id"
                            id="reviewId"
                            type="text"
                            value={reviewId}
                            disabled={true}
                            onChange={(e) => setReviewId(e.target.value)}
                        />

                        {/* Status */}
                        <div>
                            <label htmlFor='status' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Status
                            </label>
                            <select name='status' id='status' onChange={(e) => setStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={status}>
                                <option value="">Please Select</option>
                                <option value="pending">
                                    No action taken
                                </option>
                                <option value="review">
                                    Being reviewed
                                </option>
                                <option value="resolved">
                                    Resolved
                                </option>
                            </select>
                        </div>

                        {/* Provider Description */}
                        <TextareaField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Description"
                            placeholder="Provider"
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        />

                    </div>

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={editRecord} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`}>{!isLoading ? 'Submit' : '...Loading'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/report">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ReportEdit;