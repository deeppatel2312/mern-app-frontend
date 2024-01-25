import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const ProviderEdit = () => {
    // get the id from the url which is in form of /provider/edit?id=1

    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [fetchedData, setFetchedData] = useState("");
    const [active, setActive] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [verify, setVerify] = useState(false);
    const [otp, setOtp] = useState('');
    const [cancellationPolicy, setCancellationPolicy] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [location, setLocation] = useState('');
    const [plan, setPlan] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [profile, setProfile] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdf, setPdf] = useState('');
    const [showHideImage, setShowHideImage] = useState('');
    const [showHidePDF, setShowHidePDF] = useState('');
    const [allServices, setAllServices] = useState([]);
    const [services, setServices] = useState([]);
    const [businessLicenseUrl, setBusinessLicenseUrl] = useState('');
    const [businessLicense, setBusinessLicense] = useState('');
    const [showHidebusinessLicense, setShowHidebusinessLicense] = useState('');
    const [allPlans, setAllPlans] = useState([]);
    const [ratingReview, setRatingReview] = useState([]);
    const [deletedService, setDeletedService] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0)
        console.log(process.env.REACT_APP_API_URL, process.env.UPLOAD_PATH)
        const id = new URLSearchParams(window.location.search).get("id");
        setUserId(id)
        loadUsers()
        findAllServices()
        findAllPlans()
        fetchRating()
    }, []);

    const loadUsers = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setFetchedData(res.data)
                setIsLoading(false);
                setEmail(() => res.data.email)
                setFirstName(() => res.data.firstName)
                setLastName(() => res.data.lastName)
                setPhone(() => res.data.phone)
                setActive(() => res.data.isActive)
                setVerify(() => res.data.isVerified)
                // setOtp(() => res.data.otp)
                setCancellationPolicy(() => res.data.cancellationPolicy)
                setIsAvailable(() => res.data.isAvailable)
                setIsApproved(() => res.data.isApproved)
                setLocation(() => res.data.location)
                setPlan(() => res.data.plan)
                setPromoCode(() => res.data.promoCode)
                setImageUrl(() => `${process.env.REACT_APP_API_URL}/` + res.data.profilePic)
                setPdfUrl(() => `${process.env.REACT_APP_API_URL}/` + res.data.passportOrLicense)
                setBusinessLicenseUrl(() => `${process.env.REACT_APP_API_URL}/` + res.data.businessLicense)
                setServices(() => res.providerService)
                // setImageUrl(() => fetchImage(res.passportOrLicense))
                // setPdfUrl(() => fetchImage(res.profilePic))
            })
    }
    const findAllPlans = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findAllPlans`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((res) => {
                // console.log(res)
                setAllPlans(res.plans)
                setIsLoading(false);
                // cancelEdit()
            })

    }
    const findAllServices = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findAllServices`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setAllServices(res)
                setIsLoading(false);
                // cancelEdit()
            })

    }

    // const fetchImage = async (fileName) => {
    //     let results = await fetch(`${process.env.UPLOAD_PATH}/${fileName}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(resp => resp.json())
    //         .then((res) => {
    //             console.log(res)

    //         })
    // }

    const cancelEdit = () => {
        navigate("/provider");
    }

    const editProvider = () => {
        const token = localStorage.getItem('LuminixLoginToken');
        let flag = false
        // ratingReview.map((ele) => {
        //     if (ele.rating > 5) {
        //         flag = true
        //     }
        // })

        if (flag) {
            console.log("Rating can't be greater than 5")
            return;
        }

        if (deletedService.length > 0) {
            fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/deleteService`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(deletedService)
            })
                .then(resp => resp.json())
        }

        let formData = new FormData()
        formData.append("_id", fetchedData._id)
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("firstName", firstName)
        formData.append("lastName", lastName)
        // formData.append("password", password)
        formData.append("createdAt", new Date().toISOString())
        formData.append("updatedAt", new Date().toISOString())
        formData.append("isActive", active ? active : false)
        formData.append("promoCode", promoCode ? promoCode : "")
        formData.append("isVerified", verify ? verify : false)
        formData.append("cancellationPolicy", cancellationPolicy ? cancellationPolicy : "")
        formData.append("isAvailable", isAvailable ? isAvailable : false)
        formData.append("plan", plan ? plan : "")
        formData.append("userType", "provider")
        formData.append("services", JSON.stringify(services))
        formData.append("isApproved", isApproved)
        if (location?.label) {
            formData.append("location", location.label)
            formData.append("place_id", location?.value?.place_id)
        } else {
            formData.append("location", location ? location : "")
        }
        for (let i = 0; i < profile.length; i++) {
            formData.append("profilePic", profile[i])
        }
        for (let i = 0; i < businessLicense.length; i++) {
            formData.append("businessLicense", businessLicense[i])
        }
        for (let i = 0; i < pdf.length; i++) {
            formData.append("passportOrLicense", pdf[i])
        }
        setIsLoading(true);
        // console.log(formData, ratingReview)

        // fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/updateRating`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     },
        //     body: JSON.stringify(ratingReview)
        // })
        //     .then(resp => resp.json())
        //     .then((res) => {
        //         // console.log(res)
        //     })

        fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/update`, {
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
                cancelEdit()
                // setFetchedData(res)
                // setEmail(() => res.email)
                // setFirstName(() => res.firstName)
                // setLastName(() => res.lastName)
                // setPhone(() => res.phone)
            })
    }

    const onFileSelect = (event) => {
        setProfile(event.target.files)
        // console.log(event.target.files)
        const reader = new FileReader()

        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            // console.log(file)
            reader.readAsDataURL(file)

            reader.onload = (e) => {
                // console.log(reader.result, e)
                setImageUrl(reader.result)
            }
        }
    }

    const onPDFFileSelect = (event) => {
        setPdf(event.target.files)
        // console.log(event.target.files)
        const reader = new FileReader()

        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            // console.log(file)
            reader.readAsDataURL(file)

            reader.onload = (e) => {
                // console.log(reader.result, e)
                setPdfUrl(reader.result)
            }
        }
    }

    const onBusinessLicenseFileSelect = (event) => {
        setBusinessLicense(event.target.files)
        // console.log(event.target.files)
        const reader = new FileReader()

        if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            // console.log(file)
            reader.readAsDataURL(file)

            reader.onload = (e) => {
                // console.log(reader.result, e)
                setBusinessLicenseUrl(reader.result)
            }
        }
    }

    const privewImage = (data) => {
        if (data) {
            let reg1 = /.jpg/ig;
            let reg2 = /.jpeg/ig;
            let reg3 = /.png/ig;
            if (reg1.test(data) || reg2.test(data) || reg3.test(data)) {
                setShowHideImage(data)
            } else {
                let a = document.createElement("a")
                a.href = data
                a.target = "_blank"
                a.click()
            }
        } else {
            setShowHideImage(data)
        }
    }
    const privewPDF = (data) => {
        if (data) {
            let reg1 = /.jpg/ig;
            let reg2 = /.jpeg/ig;
            let reg3 = /.png/ig;
            if (reg1.test(data) || reg2.test(data) || reg3.test(data)) {
                setShowHidePDF(data)
            } else {
                let a = document.createElement("a")
                a.href = data
                a.target = "_blank"
                a.click()
            }
        } else {
            setShowHidePDF(data)
        }
    }
    const privewbusinessLicense = (data) => {
        if (data) {
            let reg1 = /.jpg/ig;
            let reg2 = /.jpeg/ig;
            let reg3 = /.png/ig;
            if (reg1.test(data) || reg2.test(data) || reg3.test(data)) {
                setShowHidebusinessLicense(data)
            } else {
                let a = document.createElement("a")
                a.href = data
                a.target = "_blank"
                a.click()
            }
        } else {
            setShowHidebusinessLicense(data)
        }
    }

    const downloadImage = () => {
        console.log(showHideImage)
        var aTag = document.createElement("a")
        aTag.href = showHideImage
        aTag.download = "image.jpg";

        document.body.appendChild(aTag);
        aTag.click();

        document.body.removeChild(aTag);
    }
    const downloadPdf = () => {
        console.log(showHidePDF)
        var aTag = document.createElement("a")
        aTag.href = showHidePDF
        aTag.download = "data.pdf";

        document.body.appendChild(aTag);
        aTag.click();

        document.body.removeChild(aTag);
    }
    const downloadBusinessLicense = () => {
        console.log(showHidebusinessLicense)
        var aTag = document.createElement("a")
        aTag.href = showHidebusinessLicense
        aTag.download = "data.pdf";

        document.body.appendChild(aTag);
        aTag.click();

        document.body.removeChild(aTag);
    }

    // const onServiceTypeChange = (data, i) => {
    //     let serviceData = services
    //     serviceData[i].serviceId._id = data
    //     setServices(serviceData)
    // }
    // const onServiceRatingChange = (data, i) => {
    //     let serviceData = services
    //     serviceData[i].rating = data
    //     setServices(serviceData)
    // }
    // const addServices = () => {
    //     setServices([...services, {
    //         rate: '',
    //         rating: '',
    //         serviceId: [
    //             {
    //                 _id: ''
    //             }
    //         ]
    //     }])
    // }

    const fetchRating = () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findByRatingId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                setRatingReview(res)
            })
    }

    const onRatingChange = (e, i) => {
        let data = ratingReview
        data[i].rating = e.target.value
        console.log(data)
        setRatingReview([...data])
    }

    const onReviewChange = (e, i) => {
        let data = ratingReview
        data[i].review = e.target.value
        setRatingReview([...data])
    }

    const addServices = () => {
        let data = services
        data.push({ serviceId: "", rate: "", })
        setServices([...data])
    }
    const onServiceRateChange = (data, i) => {
        let serviceData = services
        serviceData[i].rate = data
        setServices([...serviceData])
    }
    const onServiceTypeChange = (id, i) => {
        let data = services
        data[i].serviceId = id
        setServices([...data])
    }
    const removeServices = (index) => {
        let data = services
        let data1 = []
        if (data[index]._id) {
            setDeletedService(() => [...deletedService, data[index]])
        }
        for (let i = 0; i < data.length; i++) {
            if (i != index) {
                data1.push(services[i])
            }
        }
        setServices([...data1])
    }

    return (
        <>
            {/* <h1>User id is {userId}</h1> */}
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Update Data
                    </p>
                    {/* <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                        Update Data
                    </h4> */}
                    <div className="flex flex-wrap">
                        {/* First Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="First Name*"
                            placeholder="First Name"
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        {/* Last Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Last Name"
                            placeholder="Last Name"
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        {/* Email */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Email*"
                            placeholder="email@example.com"
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={true}
                        />

                        {/* Phone */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Phone*"
                            placeholder="1234567890"
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {/* PromoCode */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Promo Code"
                            placeholder="PromoCode"
                            id="promoCode"
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />

                        {/* Plan */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='plan' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Subscription Plan
                            </label>
                            <select name='plan' id='plan' onChange={(e) => setPlan(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={plan}>
                                <option value="">Please Select</option>
                                {
                                    allPlans.map((ele) => <option key={ele._id} value={ele._id}>{ele.name}</option>)
                                }
                            </select>
                        </div>

                        {/* Cancellation Policy */}
                        {/* <TextareaField
                            extra="mb-3 w-80 mr-5"
                            label="Cancellation Policy"
                            placeholder="Cancellation Policy"
                            id="cancellationPolicy"
                            disabled={false}
                            rows={3}
                            cols={20}
                            value={cancellationPolicy}
                            onChange={(e) => setCancellationPolicy(e.target.value)}
                        /> */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='cancellationPolicy' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Cancellation Policy*
                            </label>
                            <select name='cancellationPolicy' id='cancellationPolicy' value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`}>
                                <option value="">Select plan</option>
                                <option value="48">48 hours</option>
                                <option value="12">12 hours</option>
                                <option value="0">Any time</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="mb-3 w-80 mr-5 text-ellipsis">
                            <label htmlFor="location" className="ml-3 mb-2 text-sm font-bold truncate text-navy-700 dark:text-white">
                                Location (Current :- {location?.label ? location.label : location})
                            </label>
                            <GooglePlacesAutocomplete
                                apiKey="AIzaSyANMvigbXVdt5GfWwWMzNBF8xsCRP5rfO8"
                                placeholder='Enter Location'
                                selectProps={{
                                    location,
                                    onChange: setLocation,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap">

                        {/* Select Image  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Profile Picture
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onFileSelect(e)} name="profilePic" type="file" accept="jpeg, jpg, png" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(imageUrl)}>Preview</button>
                            </div>
                        </div>
                        {/* Select PDF  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Business License
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onBusinessLicenseFileSelect(e)} name="businessLicense" type="file" accept="pdf" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                <button className="btn btn-primary ml-2 mt-2" onClick={() => privewbusinessLicense(businessLicenseUrl)}>Preview</button>
                            </div>
                        </div>
                        {/* Select PDF  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Passport / Driving License
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onPDFFileSelect(e)} name="passportOrLicense" type="file" accept="pdf" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                <button className="btn btn-primary ml-2 mt-2" onClick={() => privewPDF(pdfUrl)}>Preview</button>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap mt-6">
                        {/* Active Status  */}
                        <div className="w-80 mr-5">
                            <SwitchField
                                id="active"
                                label="Active Status"
                                desc=""
                                value={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        </div>

                        {/* Available Status  */}
                        <div className="w-80 mr-5">
                            <SwitchField
                                id="isAvailable"
                                label="Availability Status"
                                desc=""
                                value={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                            />
                        </div>

                        {/* Approval Status  */}
                        <div className="w-80">
                            <SwitchField
                                id="isApproved"
                                label="Approval Status"
                                desc=""
                                value={isApproved}
                                onChange={(e) => setIsApproved(e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap mt-6">
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white font-medium`}>
                                <span className="font-bold text-lg text-navy-700 dark:text-white ml-1.5">
                                    Services
                                    <button className="btn btn-primary ml-2 py-[4px]" onClick={addServices}>Add Service</button>
                                </span>
                                {/* <button className="btn btn-primary" onClick={addServices}>Plus</button> */}
                            </label>
                            {
                                services.map((ele, i) => {
                                    return (
                                        <div className="flex flex-row">
                                            {/* <div>
                                                <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                                    Type
                                                </label> */}
                                            <select name='services' id='services' value={services[i]?.serviceId?._id}
                                                onChange={(e) => onServiceTypeChange(e.target.value, i)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`}>
                                                <option value="">Please Select</option>
                                                {
                                                    allServices.map((ele) => <option key={ele._id} value={ele._id}>{ele.name}</option>)
                                                }
                                            </select>
                                            {/* </div>
                                            <div>
                                                <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                                    Price
                                                </label> */}
                                            <input type="number" value={services[i]?.rate}
                                                onChange={(e) => onServiceRateChange(e.target.value, i)} placeholder="$ Price" className={`shadow-md shadow-[#a79cff] mt-2 ml-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                            {/* </div> */}
                                            {
                                                services.length > 1 &&
                                                <button className="linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[4px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200" onClick={() => removeServices(i)}>Delete</button>
                                            }
                                            {/* <div>
                                                <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                                    Rating
                                                </label>
                                                <input type="number" value={services[i]?.rating}
                                                    onChange={(e) => onServiceRatingChange(e.target.value, i)} placeholder="Rating" className={`shadow-md shadow-[#a79cff] mt-2 ml-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                            </div> */}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* <div className="flex flex-wrap mt-6">
                        <div className="mb-3 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white font-medium`}>
                                <span className="font-bold text-lg">
                                    Rating & Review
                                </span>
                            </label>
                            <table className="table table-md">
                                <thead className="sticky top-0 bg-white dark:!bg-navy-800 text-neutral-900 dark:text-white">
                                    <tr className="text-md">
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Rating</th>
                                        <th>Review</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ratingReview.map((ele, i) => {
                                            return (
                                                <tr key={i} className="border-b border-gray-400 bg-white text-black dark:bg-navy-800 text-neutral-900 dark:text-white">
                                                    <td>{i + 1}</td>
                                                    <td>{ele?.serviceId?.name}</td>
                                                    <td>
                                                        <input maxLength="1" max="5" className="shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none" type="text" name="rating" id="rating" value={ele.rating} onChange={(e) => onRatingChange(e, i)} />
                                                    </td>
                                                    <td>
                                                        <textarea maxLength="120" className="shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none" cols="30" rows="2" type="text" name="review" id="review" value={ele.review} onChange={(e) => onReviewChange(e, i)}></textarea>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div> */}

                    <div className="flex align-middle justify-center">
                        <div className="flex flex-row w-80">
                            <button onClick={editProvider} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(!firstName || !lastName || !email || !phone || phone.length < 10) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!firstName || !lastName || !email || !phone || phone.length < 10}>{isLoading ? 'Saving...' : 'Submit'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/provider">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            {
                (showHideImage || showHidePDF || showHidebusinessLicense)
                &&
                <div style={{ backgroundColor: "rgb(234 234 234 / 70%)" }} className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                    <div style={{ backgroundColor: "#fff", width: '70%', position: 'relative' }} className="mt-[10vh] w-full max-w-full flex-col items-center border border-gray-400 p-8 rounded-[8px] block">
                        <div style={{ backgroundColor: "#fff", height: '500px', overflowY: 'scroll' }} className="mt-10 flex flex-col h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle modal-img-preview">
                            {showHideImage &&
                                <>
                                    <img src={showHideImage} alt="img" style={{ height: "400px", width: "auto" }} />
                                    {/* <iframe src={showHideImage} className="aspect-video" style={{ marginTop: "20px" }}></iframe> */}
                                    <div className="flex flex-row mt-4 modal-btn">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadImage}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewImage('')}>Cancel</button>
                                    </div>
                                </>
                            }
                            {showHidePDF &&
                                <>
                                    <img src={showHidePDF} alt="img" style={{ height: "400px", width: "auto" }} />
                                    {/* <iframe src={showHidePDF} className="aspect-video" style={{ marginTop: "20px" }}>
                                    </iframe> */}
                                    <div className="flex flex-row mt-4 modal-btn">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadPdf}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewPDF('')}>Cancel</button>
                                    </div>
                                </>
                            }
                            {showHidebusinessLicense &&
                                <>
                                    <img src={showHidebusinessLicense} alt="img" style={{ height: "400px", width: "auto" }} />
                                    {/* <iframe src={showHidebusinessLicense} className="aspect-video" style={{ marginTop: "20px" }} >
                                    </iframe> */}
                                    <div className="flex flex-row mt-4 modal-btn">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadBusinessLicense}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewbusinessLicense('')}>Cancel</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ProviderEdit;