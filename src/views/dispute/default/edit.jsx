import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import DropdownSearch from "components/dropdown/DropdownSearch";
import TextareaField from "components/fields/TextField";

const DisputeEdit = () => {
    // get the id from the url which is in form of /job/edit?id=1

    const navigate = useNavigate();
    const [fetchedData, setFetchedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
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
    const [userDisputePicture, setUserDisputePicture] = useState('');
    const [providerDisputePicture, setProviderDisputePicture] = useState('');
    const [disputeStatus, setDisputeStatus] = useState('');
    const [showHideImage, setShowHideImage] = useState('');
    const [serviceName, setServiceName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        loadJob()
        getAllService()
    }, []);

    const loadJob = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getDisputeById`, {
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
                setFetchedData(res)
                setIsLoading(false);
                let data = res
                setUserId(() => data?.userId?.firstName + " " + data?.userId?.lastName)
                setProviderId(() => data?.providerId?.firstName + " " + data?.providerId?.lastName)
                setServiceId(() => data?.serviceId?._id)
                setJobId(() => data?.jobId)
                setResolvedAt(() => data?.resolvedAt)
                setServiceName(() => data?.serviceName)
                setDisputeStatus(() => data?.disputeStatus)
                setUserDescription(() => data?.userDescription)
                setProviderDescription(() => data?.providerDescription)
                setProviderDisputePicture(() => data?.providerDisputePicture)
                setUserDisputePicture(() => data?.userDisputePicture)
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

    const cancelEdit = () => {
        navigate("/dispute");
    }

    const editJob = async () => {
        let formData = new FormData()
        formData.append("_id", fetchedData._id)
        formData.append("userId", fetchedData.userId._id)
        formData.append("providerId", fetchedData.providerId._id)
        formData.append("serviceId", serviceId)
        formData.append("serviceName", serviceName)
        formData.append("jobId", jobId ? jobId : "")
        formData.append("userDescription", userDescription)
        formData.append("providerDescription", providerDescription)
        formData.append("disputeStatus", disputeStatus)
        formData.append("createdAt", new Date().toISOString())
        formData.append("updatedAt", new Date().toISOString())
        formData.append("resolvedAt", disputeStatus === "resolved" ? new Date().toISOString() : "")
        if (typeof userDisputePicture != "string") {
            for (let i = 0; i < userDisputePicture.length; i++) {
                formData.append("userDisputePicture", userDisputePicture[i])
            }
        }
        if (typeof providerDisputePicture != "string") {
            for (let i = 0; i < providerDisputePicture.length; i++) {
                formData.append("providerDisputePicture", providerDisputePicture[i])
            }
        }
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateDispute`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // body: JSON.stringify(payload)
            body: formData
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                cancelEdit()
            })
    }

    const privewImage = (data) => {
        console.log(data)
        if (typeof data == "string") {
            if (data) {
                let reg1 = /.jpg/ig;
                let reg2 = /.jpeg/ig;
                let reg3 = /.png/ig;
                if (reg1.test(data) || reg2.test(data) || reg3.test(data)) {
                    setShowHideImage(`${process.env.REACT_APP_API_URL}/` + data)
                } else {
                    let a = document.createElement("a")
                    a.href = `${process.env.REACT_APP_API_URL}/` + data
                    a.target = "_blank"
                    a.click()
                }
            } else {
                setShowHideImage(data)
            }
        } else {
            if (data) {
                const reader = new FileReader()
                const file = data[0]
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    let imgUrl = reader.result
                    let reg1 = /.jpg/ig;
                    let reg2 = /.jpeg/ig;
                    let reg3 = /.png/ig;
                    if (reg1.test(imgUrl) || reg2.test(imgUrl) || reg3.test(imgUrl)) {
                        setShowHideImage(imgUrl)
                    } else {
                        let a = document.createElement("a")
                        a.href = imgUrl
                        a.target = "_blank"
                        a.click()
                    }
                }
            } else {
                setShowHideImage(data)
            }

        }
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

                        {/* User Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="User Name"
                            placeholder="User Name"
                            id="userId"
                            type="text"
                            value={userId}
                            disabled={true}
                            onChange={(e) => setUserId(e.target.value)}
                        />

                        {/* Provider Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Provider Name"
                            placeholder="Provider Name"
                            id="providerId"
                            type="text"
                            value={providerId}
                            disabled={true}
                            onChange={(e) => setProviderId(e.target.value)}
                        />

                        {/* Service Name */}
                        <div>
                            <label htmlFor='serviceId' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Service Name (Sub Category)
                            </label>
                            <select name='serviceId' id='serviceId' onChange={(e) => setServiceId(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={serviceId} disabled>
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

                        {/* Job Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Job Id"
                            placeholder="Job Id"
                            id="jobName"
                            type="text"
                            value={jobId}
                            disabled={true}
                            onChange={(e) => setJobId(e.target.value)}
                        />

                        {/* Dispute Status */}
                        <div>
                            <label htmlFor='disputeStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Dispute Status
                            </label>
                            <select name='disputeStatus' id='disputeStatus' onChange={(e) => setDisputeStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={disputeStatus}>
                                {/* <option value="">Please Select</option> */}
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

                    </div>

                    <div className="flex flex-wrap" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                        {/* User Description */}
                        <TextareaField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Description by user*"
                            placeholder="User Description"
                            id="userDescription"
                            type="text"
                            value={userDescription}
                            onChange={(e) => {
                                setUserDescription(e.target.value)
                            }}
                        />

                        {/* Picture  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='userDisputePicture' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Picture
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setUserDisputePicture(e.target.files)} type="file" name="userDisputePicture" accept="jpeg, jpg, png" placeholder="Picture" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(userDisputePicture)}>Preview</button>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                        {/* Provider Description */}
                        <TextareaField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Description by provider*"
                            placeholder="Provider Description"
                            id="providerDescription"
                            type="text"
                            value={providerDescription}
                            onChange={(e) => {
                                setProviderDescription(e.target.value)
                            }}
                        />

                        {/* Picture  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='providerDisputePicture' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Picture
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setProviderDisputePicture(e.target.files)} type="file" name="providerDisputePicture" accept="jpeg, jpg, png" placeholder="Picture" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(providerDisputePicture)}>Preview</button>
                            </div>
                        </div>

                    </div>

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={editJob} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`}>{!isLoading ? 'Submit' : '...Loading'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/job">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div >
            {
                showHideImage
                &&
                <div style={{ backgroundColor: "rgb(234 234 234 / 70%)" }} className="fixed top-0 left-0 flex h-full w-full justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:justify-middle">
                    <div style={{ backgroundColor: "#fff", height: '500px', overflowY: 'scroll', width: '70%' }} className="mt-[10vh] w-full max-w-full flex-col items-center border border-gray-400 p-8 rounded-[8px] block">
                        <div className="mt-10 flex flex-col h-full w-full justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:justify-middle" style={{ marginTop: "360px" }}>
                            <img src={showHideImage} alt="image" style={{ marginTop: "20px", height: "400px", width: "auto" }} />
                            {/* {
                                    showHideImage.map((ele) => {
                                        return (
                                            <img src={ele} alt="image" style={{ marginTop: "20px", height: "400px", width: "auto" }} />
                                            // <iframe src={ele} className="aspect-video"
                                            //     style={{ marginTop: "20px" }}
                                            // >
                                            // </iframe>
                                        )
                                    })
                                } */}
                            <div className="flex flex-row justify-center my-4">
                                {/* <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadImage}>Download</button> */}
                                <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewImage('')}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default DisputeEdit;