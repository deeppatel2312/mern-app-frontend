import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";

const JobEdit = () => {
    // get the id from the url which is in form of /job/edit?id=1

    const navigate = useNavigate();
    const [jobId, setJobId] = useState(null);
    const [fetchedData, setFetchedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [unitPrice, setUnitPrice] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [userId, setUserId] = useState('');
    const [providerId, setProviderId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [requestStatus, setRequestStatus] = useState('');
    const [jobType, setJobType] = useState('');
    const [durationExpected, setDurationExpected] = useState('');
    const [durationUpdated, setDurationUpdated] = useState('');
    const [quoteStatus, setQuoteStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [endTime, setEndTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endSelfie, setEndSelfie] = useState('');
    const [startSelfie, setStartSelfie] = useState('');
    const [otp, setOtp] = useState('');
    const [jobDetail, setJobDetail] = useState('');
    const [quoteDescription, setQuoteDescription] = useState('');
    const [lineItemsData, setLineItemsData] = useState('');
    const [lineItemsTotal, setLineItemsTotal] = useState('');
    const [distance, setDistance] = useState('');
    const [taxPercent, setTaxPercent] = useState('');
    const [taxAmount, setTaxAmount] = useState('');
    const [trackingData, setTrackingData] = useState({});
    const [quoteFiles, setQuoteFiles] = useState([]);

    const jobStatusText = {
        "ON": "Ongoing",
        "UP": "Upcoming",
        "CO": "Completed",
        "CN": "Cancelled"
    }

    const trackingStatusText = {
        "otw": "On the way",
        "inTransit": "In Transit",
        "delivered": "Delivered"
    }

    const [sender, setSender] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [receiver, setReceiver] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [showHideImage, setShowHideImage] = useState('');




    useEffect(() => {
        window.scrollTo(0, 0)
        loadJob()
    }, []);

    const loadJob = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findJobById`, {
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
                setFetchedData(res.data)
                setIsLoading(false);
                let data = res.data
                setUnitPrice(() => data.unitPrice)
                setCalculatedPrice(() => data.calculatedPrice)
                setFinalPrice(() => data.finalPrice)
                setUserId(() => data.userId.firstName + " " + data.userId.lastName)
                setProviderId(() => data.providerId.firstName + " " + data.providerId.lastName)
                setServiceId(() => data.serviceId.name)
                setServiceName(() => data.serviceName)
                setPickupTime(() => data.pickupTime)
                setJobStatus(() => data.jobStatus)
                setJobId(() => data.jobId)
                setRequestStatus(() => data.requestStatus)
                setJobType(() => data.jobType)
                setDurationExpected(() => data.durationExpected)
                setDurationUpdated(() => data.durationUpdated)
                setQuoteStatus(() => data.quoteStatus)
                setPaymentStatus(() => data.paymentStatus)
                let calEndDate = new Date(data.endTime).toLocaleString().split(",")[0].split("/")
                let calEndDateTime = calEndDate[2] + "-" + calEndDate[0] + "-" + calEndDate[1] + "T" + (new Date(data.endTime).toLocaleString().split(" ")[1].length == 8 ? new Date(data.endTime).toLocaleString().split(" ")[1] : "0" + new Date(data.endTime).toLocaleString().split(" ")[1])
                setEndTime(() => data.endTime ? calEndDateTime : "")
                let calStartDate = new Date(data.startTime).toLocaleString().split(",")[0].split("/")
                let calStartDateTime = calStartDate[2] + "-" + calStartDate[0] + "-" + calStartDate[1] + "T" + (new Date(data.startTime).toLocaleString().split(" ")[1].length == 8 ? new Date(data.startTime).toLocaleString().split(" ")[1] : "0" + new Date(data.startTime).toLocaleString().split(" ")[1])
                setStartTime(() => data.startTime ? calStartDateTime : "")
                setEndSelfie(() => data.endSelfie)
                setStartSelfie(() => data.startSelfie)
                setOtp(() => data.otp)
                setJobDetail(() => data.jobDetail)
                setQuoteDescription(() => data.quoteDescription)
                setLineItemsData(() => data.lineItemsData ? JSON.parse(data.lineItemsData) : "")
                setLineItemsTotal(() => data.lineItemsTotal)
                setDistance(() => data.distance)
                setTaxPercent(() => data.taxPercent)
                setTaxAmount(() => data.taxAmount)
                setTrackingData(() => data.trackingStatus)
                console.log('tracking status is', data.trackingStatus)
                setQuoteFiles(() => data.quoteFiles ? data.quoteFiles : [])
            })
    }

    const cancelEdit = () => {
        navigate("/job");
    }

    const generateInvoice = async (jobId) => {
        const id = new URLSearchParams(window.location.search).get("id");

        const invoiceButton = document.getElementById(`invoiceBtn`);
        if (invoiceButton) {
            invoiceButton.innerText = "Loading...";
            invoiceButton.disabled = true;
            invoiceButton.style.cursor = "not-allowed";
        }

        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/job/generateInvoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ jobId: id })
        })
            .then(resp => resp.json())
            .then((res) => {
                if (res.status === true) {
                    window.open(process.env.REACT_APP_API_URL + '/' + res.invoicePath, '_blank').focus();
                    const invoiceButton = document.getElementById(`invoiceBtn`);
                    if (invoiceButton) {
                        invoiceButton.innerText = "Invoice";
                        invoiceButton.disabled = false;
                        invoiceButton.style.cursor = "pointer";
                    }
                }
            })
    }

    const editJob = async () => {
        let payload = {
            // ...fetchedData,
            _id: fetchedData._id,
            unitPrice,
            calculatedPrice,
            finalPrice,
            userId: fetchedData.userId._id,
            providerId: fetchedData.providerId._id,
            serviceId: fetchedData.serviceId._id,
            serviceName,
            pickupTime: pickupTime ? new Date(pickupTime).toISOString() : "",
            jobStatus,
            requestStatus,
            jobType,
            durationExpected,
            durationUpdated,
            quoteStatus,
            endTime: endTime ? new Date(endTime).toISOString() : "",
            startTime: startTime ? new Date(startTime).toISOString() : "",
            endSelfie,
            startSelfie,
            otp,
            jobDetail,
            distance,
            taxPercent,
            taxAmount,
            quoteFiles
        }

        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateJob`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(resp => resp.json())
            .then((res) => {
                setIsLoading(false);
                cancelEdit()
            })
    }

    const privewImage = (data) => {
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
    }

    const calculatePrice = (newUnitprice, newDurationExpected) => {
        if (newUnitprice && newDurationExpected) {
            let newCalculatedPrice = newUnitprice * newDurationExpected
            let newTaxPrice = newCalculatedPrice * 0.1
            setCalculatedPrice(newCalculatedPrice)
            setFinalPrice(newCalculatedPrice + newTaxPrice)
            setTaxAmount(newTaxPrice)
        } else {
            setCalculatedPrice('')
            setTaxAmount("")
            setFinalPrice('')
        }
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Updating Job - {jobId}
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
                            id="durationExpected"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            disabled={true}
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
                            onChange={(e) => setProviderId(e.target.value)}
                            disabled={true}
                        />

                        {/* Service Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Service Name"
                            placeholder="Service Name"
                            id="serviceId"
                            type="text"
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value)}
                            disabled={true}
                        />
                    </div>

                    <br />

                    <div className="flex flex-wrap">
                        {/* Request Status */}
                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Request Status
                            </label>
                            <select name='jobStatus' id='jobStatus' onChange={(e) => setRequestStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={requestStatus}>
                                <option value="">Please Select</option>
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="accepted">
                                    Accepted
                                </option>
                                <option value="rejected">
                                    Rejected
                                </option>
                            </select>
                        </div>

                        {/* Quote Status */}
                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Quote Status
                            </label>
                            <select name='jobStatus' id='jobStatus' onChange={(e) => setQuoteStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={quoteStatus}>
                                <option value="">Please Select</option>
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="accepted">
                                    Accepted
                                </option>
                                <option value="rejected">
                                    Rejected
                                </option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Job Status
                            </label>
                            <select name='jobStatus' id='jobStatus' onChange={(e) => setJobStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={jobStatus}>
                                <option key="default" value={null}>
                                    Please Select
                                </option>
                                {Object.entries(jobStatusText).map(([value, text]) => (
                                    <option key={value} value={value} selected={value === jobStatus}>
                                        {text}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Status */}
                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Payment Status
                            </label>
                            <select name='jobStatus' id='jobStatus' onChange={(e) => setPaymentStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={paymentStatus}>
                                <option value="">Please Select</option>
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="completed">
                                    Completed
                                </option>
                            </select>
                        </div>


                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Tracking Status
                            </label>
                            <select disabled={true} name='jobStatus' id='jobStatus' onChange={(e) => setJobStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={trackingData}>
                                <option key="default" value={null}>
                                    Please Select
                                </option>
                                {Object.entries(trackingStatusText).map(([value, text]) => (
                                    <option key={value} value={value} selected={value === trackingData}>
                                        {text}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <br />

                    <p className="text-sm text-blue-400">INFO: Calculated price and final price are affected by durations. If "Duration updated" has value, then "Duration expected" field's value has no effect and is disabled.</p>
                    <br />
                    <div className="flex flex-wrap">
                        {/* Duration Expected */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Duration expected (in hours)"
                            placeholder="Duration expected (in hours)"
                            id="durationExpected"
                            type="number"
                            min={1}
                            disabled={durationUpdated ? true : false}
                            value={durationExpected}
                            onChange={(e) => {
                                setDurationExpected(e.target.value)
                                calculatePrice(unitPrice, e.target.value)
                            }}
                        />

                        {/* Duration Updated */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Duration updated (in hours)"
                            placeholder="Duration updated (in hours)"
                            id="durationUpdated"
                            min={1}
                            type="number"
                            value={durationUpdated}
                            onChange={(e) => {
                                setDurationUpdated(e.target.value)
                                calculatePrice(unitPrice, e.target.value)
                            }}
                        />

                        {/* Start Time */}
                        <div>
                            <label htmlFor='startTime' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Start Time/Pickup Time
                            </label>
                            <input style={{ filter: "invert(1)" }} type="datetime-local" name='startTime' id='startTime' className="mb-3 w-80 mr-4 shadow-md shadow-[#68721a] mt-2 flex h-12 items-center justify-center rounded-xl  bg-white/0 p-3 text-sm outline-none" onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor='endTime' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                End Time
                            </label>
                            <input style={{ filter: "invert(1)" }} type="datetime-local" name='endTime' id='endTime' className="mb-3 w-80 mr-4 shadow-md shadow-[#68721a] mt-2 flex h-12 items-center justify-center rounded-xl  bg-white/0 p-3 text-sm outline-none" onChange={(e) => setEndTime(e.target.value)} value={endTime} />
                        </div>
                    </div>

                    <br />

                    <div className="flex flex-wrap">
                        {/* Unit Price */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Unit price (hourly rate of provider)"
                            placeholder="Unit price (hourly rate of provider)"
                            id="unitPrice"
                            type="number"
                            disabled={true}
                            value={unitPrice}
                            onChange={(e) => {
                                setUnitPrice(e.target.value)
                                calculatePrice(e.target.value, durationExpected)
                            }}
                        />

                        {/* Calculated Price */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Calculated Price"
                            placeholder="Calculated Price"
                            id="calculatedPrice"
                            type="number"
                            value={calculatedPrice}
                            onChange={(e) => setCalculatedPrice(e.target.value)}
                            disabled={true}
                        />

                        {/* Final Price */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Final price (Calculated price + 10% VAT)"
                            placeholder="Final price (Calculated price + 10% VAT)"
                            id="finalPrice"
                            type="number"
                            value={finalPrice}
                            onChange={(e) => setFinalPrice(e.target.value)}
                            disabled={true}
                        />
                    </div>

                    <br />

                    <div className="flex flex-wrap">
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Job Detail"
                            placeholder="Job Detail"
                            id="jobDetail"
                            type="text"
                            value={jobDetail}
                            onChange={(e) => setJobDetail(e.target.value)}
                        />

                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Distance (in km.)"
                            placeholder="Distance (in km.)"
                            id="distance"
                            type="text"
                            disabled={true}
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />

                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Job OTP (sent to customer)"
                            placeholder="Job OTP"
                            id="otp"
                            disabled={true}
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Quote Description"
                            placeholder="Quote Description"
                            id="quoteDescription"
                            type="text"
                            value={quoteDescription}
                            onChange={(e) => setQuoteDescription(e.target.value)}
                        />
                    </div>

                    <br />

                    <div className="flex space-x-24">
                        {lineItemsData && lineItemsData.length > 0 && (
                            <div>
                                <label className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    Line items data (added by provider)
                                </label>
                                <div class="overflow-x-auto border border-1 mt-5">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Item name</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lineItemsData && lineItemsData.map((item, index) => (
                                                <tr key={index}>
                                                    <th>{index + 1}</th>
                                                    <th>{Object.keys(item)[0]}</th>
                                                    <th>{Object.values(item)[0]}</th>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <th>Total</th>
                                                <th>{lineItemsTotal}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}

                        {quoteFiles.length > 0 && (
                            <div className="ml-12">
                                <label className={`text-sm text-navy-700 dark:text-white font-medium`}>
                                    Quote Files
                                </label>
                                <div className="flex flex-col">
                                    {
                                        quoteFiles && quoteFiles.map((ele) => {
                                            return (
                                                <div className="flex flex-row items-center justify-between">
                                                    <span className="text-sm">
                                                        {ele}
                                                    </span>
                                                    <button className="ml-2 mt-2 bg-brand-400 rounded px-4 py-2 text-xs text-white hover:bg-brand-500" onClick={() => privewImage(ele)}>Preview</button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )}

                        {startSelfie && (
                            <div div className="">
                                <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    Start Selfie
                                </label>
                                <div className="flex flex-row">
                                    {/* <input disabled onChange={e => setStartSelfie(e.target.files)} type="file" name="startSelfie" accept="jpeg, jpg, png" placeholder="Start Selfie" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} /> */}
                                    <button className="btn bg-brand-400 text-white ml-2 mt-2 hover:bg-brand-500" onClick={() => privewImage(startSelfie)}>Preview</button>
                                </div>
                            </div>
                        )}

                        {endSelfie && (
                            <div className="">
                                <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    End Selfie
                                </label>
                                <div className="flex flex-row">
                                    <button className="btn bg-brand-400 text-white ml-2 mt-2 hover:bg-brand-500" onClick={() => privewImage(endSelfie)}>Preview</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <br />

                    {paymentStatus == 'completed' && (
                        <>
                            <div className="flex space-x-24">
                                <button id="invoiceBtn" className="btn bg-brand-400 text-sm text-white hover:bg-brand-500" onClick={() => generateInvoice()}>Invoice</button>
                            </div>
                            <br />
                        </>
                    )}

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={editJob} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={false}>Submit</button>
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

export default JobEdit;