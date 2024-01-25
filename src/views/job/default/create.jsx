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

const JobCreate = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const [userOption, setUserOption] = useState([]);
    const [providerOption, setProviderOption] = useState([]);
    const [userList, setUserList] = useState([]);
    const [providerList, setProviderList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [unitPrice, setUnitPrice] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [userId, setUserId] = useState('');
    const [providerId, setProviderId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [jobStatus, setJobStatus] = useState('UP');
    const [requestStatus, setRequestStatus] = useState('');
    const [jobType, setJobType] = useState('');
    const [durationActual, setDurationActual] = useState('');
    const [durationExpected, setDurationExpected] = useState('');
    const [quoteStatus, setQuoteStatus] = useState('pending');
    const [endTime, setEndTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endSelfie, setEndSelfie] = useState('');
    const [startSelfie, setStartSelfie] = useState('');
    const [otp, setOtp] = useState('');
    const [jobDetail, setJobDetail] = useState('');
    // const [taxPercent, setTaxPercent] = useState(process.env.TAX_PERCENT);
    const [taxPercent, setTaxPercent] = useState(10);
    const [taxAmount, setTaxAmount] = useState('');
    const [quoteFiles, setQuoteFiles] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [saveSenderAddress, setSaveSenderAddress] = useState(false);
    const [saveReceiverAddress, setSaveReceiverAddress] = useState(false);
    const [sender, setSender] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        place_id: "",
        address: ""
    });
    const [receiver, setReceiver] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        place_id: "",
        address: ""
    });

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0)
        // console.log(getAllUser("aaa"))
        // getAllProvider()
        getAllService()
    }, []);

    const cancelEdit = () => {
        navigate("/job");
    }

    useEffect(() => {
        // console.log(senderAddress, receiverAddress)
        let senderData = { ...sender }
        if (senderAddress) {
            senderData["address"] = senderAddress?.label
            senderData["place_id"] = senderAddress?.value.place_id
        } else {
            senderData["address"] = ""
            senderData["place_id"] = ""
        }
        setSender(senderData)
        let receiverData = { ...receiver }
        if (receiverAddress) {
            receiverData['address'] = receiverAddress?.label
            receiverData['place_id'] = receiverAddress?.value.place_id
        } else {
            receiverData['address'] = ""
            receiverData['place_id'] = ""
        }
        setReceiver(receiverData)
    }, [senderAddress, receiverAddress])
    const createJob = async () => {
        let selectedServiceId = serviceId
        if (jobType === "650d86a19105a0c42e344f31" || jobType === "650d86b79105a0c42e344f36") {
            setServiceId(jobType)
            selectedServiceId = jobType
        }
        let selectedServiceName = ""
        serviceList.map((ele) => {
            if (ele._id === selectedServiceId) {
                selectedServiceName = ele.name
            }
        })
        let formData = new FormData()
        formData.append("unitPrice", unitPrice)
        formData.append("calculatedPrice", calculatedPrice)
        formData.append("finalPrice", finalPrice)
        formData.append("userId", userId)
        formData.append("providerId", providerId)
        formData.append("serviceId", selectedServiceId)
        formData.append("serviceName", selectedServiceName)
        formData.append("pickupTime", pickupTime ? new Date(pickupTime).toISOString() : "")
        formData.append("jobStatus", jobStatus)
        formData.append("requestStatus", requestStatus)
        formData.append("jobType", jobType)
        formData.append("durationActual", durationActual)
        formData.append("durationExpected", durationExpected)
        formData.append("quoteStatus", quoteStatus)
        formData.append("endTime", endTime ? new Date(endTime).toISOString() : "")
        formData.append("startTime", startTime ? new Date(startTime).toISOString() : "")
        formData.append("otp", otp)
        formData.append("jobDetail", jobDetail)
        formData.append("taxPercent", taxPercent)
        formData.append("taxAmount", taxAmount)
        formData.append("sender", JSON.stringify(sender))
        formData.append("receiver", JSON.stringify(receiver))
        formData.append("saveReceiverAddress", saveReceiverAddress)
        formData.append("saveSenderAddress", saveSenderAddress)
        for (let i = 0; i < endSelfie.length; i++) {
            formData.append("endSelfie", endSelfie[i])
        }
        for (let i = 0; i < startSelfie.length; i++) {
            formData.append("startSelfie", startSelfie[i])
        }
        for (let i = 0; i < quoteFiles.length; i++) {
            formData.append("quoteFiles", quoteFiles[i])
        }
        // return;
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/createJob`, {
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

    const getAllUser = (inputValue) => {
        const token = localStorage.getItem('LuminixLoginToken');
        let payload = {
            pageNumber: 1,
            pageSize: 1000000000,
            sortField: "createdAt",
            sortOrder: "desc",
            search: inputValue
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findAll`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
            .then((res) => {
                let userOpt = []
                res.users.map((ele) => {
                    userOpt.push({ value: ele._id, label: ele.firstName + " " + ele.lastName })
                })
                return userOpt
                // setUserList(opt)
            }).catch((err) => {
                console.log(err)
                return []
            })
    }

    const getAllProvider = () => {
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/getAllProvider`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.json())
            .then((res) => {
                // console.log(res)
                setProviderList(res)
            }).catch((err) => {
                console.log(err)
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

    const onSenderChange = (value, field) => {
        console.log(value, field)
        let senderData = { ...sender }
        senderData[field] = value
        setSender(senderData)
    }

    const onReceiverChange = (value, field) => {
        let receiverData = { ...receiver }
        receiverData[field] = value
        setReceiver(receiverData)
    }

    const calculatePrice = (newUnitprice, newDurationExpected) => {
        if (newUnitprice && newDurationExpected) {
            let newCalculatedPrice = newUnitprice * newDurationExpected
            // console.log(process.env.TAX_PERCENT, process.env)
            let newTaxPrice = newCalculatedPrice * (10 / 100)
            setCalculatedPrice(newCalculatedPrice)
            setFinalPrice(newCalculatedPrice + newTaxPrice)
            setTaxAmount(newTaxPrice)
        } else {
            setCalculatedPrice('')
            setTaxAmount("")
            setFinalPrice('')
        }
    }

    const onUserchange = (selectedValue) => {
        console.log(selectedValue)
        setUserId(selectedValue)
    }

    const filterColors = (inputValue) => {
        return options.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const loadOptions = (inputValue, callback) => {
        if (inputValue.length > 2) {
            setTimeout(() => {
                // callback(filterColors(inputValue));
                // console.log(getAllUser(inputValue))
                // callback(getAllUser(inputValue));
            }, 1000);
            // new Promise((resolve) => {
            //     setTimeout(() => {
            //     //   resolve(filterColors(inputValue));
            //       resolve(getAllUser(inputValue));
            //     }, 1000);
            //   })
        } else {
            return []
        }
    };

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>

                    <div className="flex flex-wrap">

                        {/* User Name */}
                        {/* <div className="mb-3 w-80 mr-5">
                            <label htmlFor='userId' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                User Name*
                            </label> */}
                        {/* <select name='userId' id='userId' onChange={(e) => setUserId(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={userId}>
                                <option value="">Please Select</option>
                                {
                                    userList && userList.map((item) => {
                                        return (
                                            <option value={item._id} key={item._id}>
                                                {item.firstName} {item.lastName}
                                            </option>
                                        )
                                    })
                                }
                            </select> */}
                        {/* </div> */}
                        <DropdownSearch
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="User Name* (3 characters minimum)"
                            placeholder="User Name"
                            id="userName"
                            type="text"
                            value={userId}
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
                        {/* <div className="mb-3 w-80 mr-5">
                            <label htmlFor='providerId' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Provider Name*
                            </label> */}
                        {/* <select name='providerId' id='providerId' onChange={(e) => setProviderId(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={providerId}>
                                <option value="">Please Select</option>
                                {
                                    providerList && providerList.map((item) => {
                                        return (
                                            <option value={item._id} key={item._id}>
                                                {item.firstName} {item.lastName}
                                            </option>
                                        )
                                    })
                                }
                            </select> */}
                        <DropdownSearch
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Provider Name* (3 characters minimum)"
                            placeholder="Provider Name"
                            id="providerName"
                            type="text"
                            value={providerId}
                            api="/api/admin-user/findAll"
                            onClick={(e) => {
                                // console.log(e)
                                setProviderId(e)
                            }}
                            payload={
                                { userType: "provider" }
                            }
                        />

                        {/* Job Type */}
                        <div>
                            <label htmlFor='jobType' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Job Type (Category)*
                            </label>
                            <select name='jobType' id='jobType' onChange={(e) => {
                                setJobType(e.target.value)
                                setServiceId("")
                                setJobDetail("")
                                setQuoteStatus("pending")
                                setSaveReceiverAddress(false)
                                setSaveSenderAddress(false)
                                setSender({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    phone: "",
                                    address: ""
                                })
                                setReceiver({
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    phone: "",
                                    address: ""
                                })
                            }} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={jobType}>
                                <option value="">Please Select</option>
                                {
                                    serviceList && serviceList.map((item) => {
                                        return (
                                            <>
                                                {
                                                    !item.parent &&
                                                    <option value={item._id} key={item._id}>
                                                        {item.name}
                                                    </option>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        {/* Service Name */}
                        <div>
                            <label htmlFor='serviceId' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Service Name (Sub Category)
                                {
                                    jobType === "650d86849105a0c42e344f2c" &&
                                    <span>*</span>
                                }
                            </label>
                            <select name='serviceId' id='serviceId' onChange={(e) => setServiceId(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={serviceId}>
                                <option value="">Please Select</option>
                                {
                                    serviceList && serviceList.map((item) => {
                                        return (
                                            <>
                                                {
                                                    item.parent === jobType &&
                                                    <option value={item._id} key={item._id}>
                                                        {item.name}
                                                    </option>
                                                }
                                            </>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        {/* Job Status */}
                        <div>
                            <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Job Status
                            </label>
                            <select name='jobStatus' id='jobStatus' onChange={(e) => setJobStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={jobStatus}>
                                {/* <option value="">Please Select</option> */}
                                <option value="ON">
                                    Ongoing
                                </option>
                                <option value="UP">
                                    Upcoming
                                </option>
                                <option value="CO">
                                    Completed
                                </option>
                                <option value="CA">
                                    Canceled
                                </option>
                            </select>
                        </div>

                        {/* Unit Price */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Unit price (hourly rate)*"
                            placeholder="Unit price (hourly rate)"
                            id="unitPrice"
                            type="number"
                            value={unitPrice}
                            onChange={(e) => {
                                setUnitPrice(e.target.value)
                                calculatePrice(e.target.value, durationExpected)
                            }}
                        />

                        {/* Duration Expected */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Duration expected (in hours)*"
                            placeholder="Duration expected (in hours)"
                            id="durationExpected"
                            type="number"
                            maxlength={2}
                            value={durationExpected}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={(e) => {
                                setDurationExpected(e.target.value)
                                calculatePrice(unitPrice, e.target.value)
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

                        {/* Start Time */}
                        <div>
                            <label htmlFor='startTime' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Start Time
                            </label>
                            <input style={{ filter: "invert(1)" }} type="datetime-local" name='startTime' id='startTime' className="mb-3 w-80 mr-4 shadow-md shadow-[#68721a] mt-2 flex h-12 items-center justify-center rounded-xl  bg-white/0 p-3 text-sm outline-none" onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                        </div>

                        {/* Quote Status */}
                        {
                            jobType === "650d86a19105a0c42e344f31" &&
                            <div>
                                <label htmlFor='jobStatus' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    Quote Status
                                </label>
                                <select name='jobStatus' id='jobStatus' onChange={(e) => setQuoteStatus(e.target.value)} className={`mb-3 w-80 mr-4 shadow-md shadow-[#a79cff] mt-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={quoteStatus}>
                                    {/* <option value="">Please Select</option> */}
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
                        }

                    </div>

                    <div className="flex flex-wrap" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                        {/* Job Detail */}
                        {
                            jobType === "650d86849105a0c42e344f2c" &&
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
                        }

                        {/* Start Selfie  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Start Selfie
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setStartSelfie(e.target.files)} type="file" name="startSelfie" accept="jpeg, jpg, png" placeholder="Start Selfie" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(startSelfie)}>Preview</button> */}
                            </div>
                        </div>

                        {/* End Selfie  */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                End Selfie
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => setEndSelfie(e.target.files)} type="file" name="endSelfie" accept="jpeg, jpg, png" placeholder="End Selfie" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(endSelfie)}>Preview</button> */}
                            </div>
                        </div>

                        {/* Quote Files */}
                        <div className="mb-3 w-80 mr-4">
                            <label htmlFor='quoteFiles' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Quote Files
                            </label>
                            <div className="flex flex-row">
                                <input multiple onChange={e => setQuoteFiles(e.target.files)} type="file" name="quoteFiles" accept="jpeg, jpg, png" placeholder="Quote Files" className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(endSelfie)}>Preview</button> */}
                            </div>
                        </div>

                    </div>

                    {
                        (jobType === "650d86a19105a0c42e344f31" || jobType === "650d86b79105a0c42e344f36") &&
                        <div className="flex flex-col" style={{ borderTop: "2px solid #000", marginTop: "10px", paddingTop: "10px" }}>

                            {/* Sender  */}
                            <h3>Sender</h3>
                            <div className="flex flex-wrap">
                                {/* First Name */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="First Name"
                                    placeholder="First Name"
                                    id="senderFirstName"
                                    type="text"
                                    value={sender.firstName}
                                    onChange={(e) => onSenderChange(e.target.value, "firstName")}
                                />

                                {/* Last Name */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    id="senderLastName"
                                    type="text"
                                    value={sender.lastName}
                                    onChange={(e) => onSenderChange(e.target.value, "lastName")}
                                />

                                {/* email */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Email"
                                    placeholder="abc@gmail.com"
                                    id="senderEmail"
                                    type="text"
                                    value={sender.email}
                                    onChange={(e) => onSenderChange(e.target.value, "email")}
                                />

                                {/* Phone */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Phone"
                                    placeholder="1234567890"
                                    id="senderPhone"
                                    type="number"
                                    value={sender.phone}
                                    onChange={(e) => onSenderChange(e.target.value, "phone")}
                                />

                                {/* Address */}
                                {/* <TextareaField
                                    label='Address'
                                    id='senderAddress'
                                    extra='mb-3 w-80 mr-4'
                                    placeholder='Address'
                                    cols={20}
                                    rows={2}
                                    state=''
                                    disabled={false}
                                    value={sender.address}
                                    onChange={(e) => onSenderChange(e.target.value, "address")}
                                /> */}
                                <div className="mb-3 w-80 mr-5">
                                    <label htmlFor="senderlocation" className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white">
                                        Address
                                    </label>
                                    <GooglePlacesAutocomplete
                                        apiKey="AIzaSyANMvigbXVdt5GfWwWMzNBF8xsCRP5rfO8"
                                        selectProps={{
                                            senderAddress,
                                            onChange: setSenderAddress,
                                        }}
                                    />
                                </div>

                                <div className="w-80 mt-5 mr-4">
                                    <SwitchField
                                        id="saveSenderAddress"
                                        label="Save Sender Address"
                                        desc=""
                                        value={saveSenderAddress}
                                        onChange={(e) => setSaveSenderAddress(e.target.checked)}
                                    />
                                </div>
                            </div>

                            {/* Receiver  */}
                            <h3>Receiver</h3>
                            <div className="flex flex-wrap">
                                {/* First Name */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="First Name"
                                    placeholder="First Name"
                                    id="receiverFirstName"
                                    type="text"
                                    value={receiver.firstName}
                                    onChange={(e) => onReceiverChange(e.target.value, "firstName")}
                                />

                                {/* Last Name */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    id="receiverLastName"
                                    type="text"
                                    value={receiver.lastName}
                                    onChange={(e) => onReceiverChange(e.target.value, "lastName")}
                                />

                                {/* email */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Email"
                                    placeholder="abc@gmail.com"
                                    id="receiverEmail"
                                    type="text"
                                    value={receiver.email}
                                    onChange={(e) => onReceiverChange(e.target.value, "email")}
                                />

                                {/* Phone */}
                                <InputField
                                    variant="auth"
                                    extra="mb-3 w-80 mr-4"
                                    label="Phone"
                                    placeholder="1234567890"
                                    id="receiverPhone"
                                    type="number"
                                    value={receiver.phone}
                                    onChange={(e) => onReceiverChange(e.target.value, "phone")}
                                />

                                {/* Address */}
                                {/* <TextareaField
                                    label='Address'
                                    id='receiverAddress'
                                    extra='mb-3 w-80 mr-4'
                                    placeholder='Address'
                                    cols={20}
                                    rows={2}
                                    state=''
                                    disabled={false}
                                    value={receiver.address}
                                    onChange={(e) => onReceiverChange(e.target.value, "address")}
                                /> */}
                                <div className="mb-3 w-80 mr-5">
                                    <label htmlFor="receiverAddress" className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white">
                                        Address
                                    </label>
                                    <GooglePlacesAutocomplete
                                        apiKey="AIzaSyANMvigbXVdt5GfWwWMzNBF8xsCRP5rfO8"
                                        selectProps={{
                                            receiverAddress,
                                            onChange: setReceiverAddress,
                                        }}
                                    />
                                </div>

                                <div className="w-80 mr-4 mt-5">
                                    <SwitchField
                                        id="saveReceiverAddress"
                                        label="Save Receiver Address"
                                        desc=""
                                        value={saveReceiverAddress}
                                        onChange={(e) => setSaveReceiverAddress(e.target.checked)}
                                    />
                                </div>
                            </div>

                        </div>
                    }

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={createJob} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!userId || !providerId || (!serviceId && jobType === '650d86849105a0c42e344f2c') || !jobType || !unitPrice || !durationExpected || !startTime) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!userId || !providerId || (!serviceId && jobType === '650d86849105a0c42e344f2c') || !jobType || !unitPrice || !durationExpected || !startTime}>{!isLoading ? 'Submit' : '...Loading'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/job">Cancel</Link></button>
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

export default JobCreate;