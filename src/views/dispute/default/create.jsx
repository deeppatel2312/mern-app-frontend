import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DropdownSearch from "components/dropdown/DropdownSearch";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const DisputeCreate = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [serviceList, setServiceList] = useState([]);

    const [userId, setUserId] = useState('');
    const [providerId, setProviderId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [jobId, setJobId] = useState('');
    const [userDescription, setUserDescription] = useState('');
    const [providerDescription, setProviderDescription] = useState('');
    const [resolvedAt, setResolvedAt] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [userDesputePicture, setUserDesputePicture] = useState('');
    const [providerDesputePicture, setProviderDesputePicture] = useState('');
    const [disputeStatus, setDisputeStatus] = useState('pending');



    useEffect(() => {
        window.scrollTo(0, 0)
        // console.log(getAllUser("aaa"))
        // getAllProvider()
        getAllService()
    }, []);

    const cancelEdit = () => {
        navigate("/dispute");
    }

    const createDispute = async () => {
        let selectedServiceId = serviceId
        let selectedServiceName = ""
        serviceList.map((ele) => {
            if (ele._id === selectedServiceId) {
                selectedServiceName = ele.name
            }
        })
        let formData = new FormData()
        formData.append("userId", userId)
        formData.append("providerId", providerId)
        formData.append("serviceId", selectedServiceId)
        formData.append("serviceName", selectedServiceName)
        formData.append("jobId", jobId)
        formData.append("userDescription", userDescription)
        formData.append("providerDescription", providerDescription)
        formData.append("disputeStatus", disputeStatus)
        formData.append("createdAt", new Date().toISOString())
        formData.append("updatedAt", new Date().toISOString())
        formData.append("resolvedAt", "")
        for (let i = 0; i < userDesputePicture.length; i++) {
            formData.append("userDesputePicture", userDesputePicture[i])
        }
        for (let i = 0; i < providerDesputePicture.length; i++) {
            formData.append("providerDesputePicture", providerDesputePicture[i])
        }
        // return;
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/createDispute`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                if (res?.status == "failure") {
                    setErrorMessage(res.message)
                } else {
                    cancelEdit()
                }
            })
    }

    const getAllService = () => {
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findAllServices`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                // console.log(res)
                setServiceList(res)
            }).catch((err) => {
                console.log(err)
            })
    }


    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>

                    <div className="flex flex-wrap">

                        {/* User Name */}
                        <DropdownSearch
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="User Name* (3 characters minimum)"
                            placeholder="User Name"
                            id="userName"
                            type="text"
                            value={userId}
                            resultType="users"
                            api="/api/admin-user/findAll"
                            onClick={(e) => {
                                // console.log(e)
                                setUserId(e)
                            }}
                            extrapayload={
                                { userType: "user" }
                            }
                        />

                        {/* Provider Name */}
                        <DropdownSearch
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Provider Name* (3 characters minimum)"
                            placeholder="Provider Name"
                            id="providerName"
                            type="text"
                            value={providerId}
                            resultType="providers"
                            api="/api/admin-provider/findAll"
                            onClick={(e) => {
                                // console.log(e)
                                setProviderId(e)
                            }}
                            payload={
                                { userType: "provider" }
                            }
                        />

                        {/* Service Name */}
                        <div>
                            <label htmlFor='serviceId' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Service Name (Sub Category)
                            </label>
                            <select name='serviceId' id='serviceId' onChange={(e) => setServiceId(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={serviceId}>
                                <option value="">Please Select</option>
                                {
                                    serviceList && serviceList.map((item) => {
                                        return (
                                            <>
                                                <option value={item._id} key={item._id}>
                                                    {item.name}
                                                </option>
                                            </>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        {/* Job Id */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Job Id"
                            placeholder="Job Id"
                            id="jobName"
                            type="text"
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                        />

                        {/* Dispute Status */}
                        {/* <div>
                            <label htmlFor='disputeStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Dispute Status
                            </label>
                            <select name='disputeStatus' id='disputeStatus' onChange={(e) => setDisputeStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={disputeStatus}>
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
                        </div> */}

                    </div>

                    <div className="flex flex-wrap" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                        {/* User Description */}
                        <TextareaField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="User Description*"
                            placeholder="User Description"
                            id="userDescription"
                            type="number"
                            value={userDescription}
                            onChange={(e) => {
                                setUserDescription(e.target.value)
                            }}
                        />

                        {/* User Dispute Picture  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='userDesputePicture' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                User Dispute Picture
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setUserDesputePicture(e.target.files)} type="file" name="userDesputePicture" accept="jpeg, jpg, png" placeholder="User Dispute Picture" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(startSelfie)}>Preview</button> */}
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                        {/* Provider Description */}
                        <TextareaField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Provider Description*"
                            placeholder="Provider Description"
                            id="providerDescription"
                            type="text"
                            value={providerDescription}
                            onChange={(e) => {
                                setProviderDescription(e.target.value)
                            }}
                        />

                        {/* Provider Dispute Picture  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='providerDesputePicture' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Provider Dispute Picture
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setProviderDesputePicture(e.target.files)} type="file" name="providerDesputePicture" accept="jpeg, jpg, png" placeholder="Provider Dispute Picture" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(endSelfie)}>Preview</button> */}
                            </div>
                        </div>

                    </div>


                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={createDispute} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!userId || !providerId || !serviceId || !jobId) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!userId || !providerId || !serviceId || !jobId}>{!isLoading ? 'Submit' : '...Loading'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/dispute">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessage &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h4 className="mb-2.5 text-s font-bold text-center text-red-500 dark:text-white">
                            {errorMessage}
                        </h4>
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={() => setErrorMessage(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default DisputeCreate;