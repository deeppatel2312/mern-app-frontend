import React, { useEffect, useState, useScript } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";
import Dropdown from "components/dropdown";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';


const ProviderCreate = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(true);
    const [verify, setVerify] = useState(true);
    const [cancellationPolicy, setCancellationPolicy] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [location, setLocation] = useState("");
    const [plan, setPlan] = useState('');
    const [allServices, setAllServices] = useState([]);
    const [services, setServices] = useState([{ serviceId: "", rate: "" }]);
    const [profileUrl, setProfileUrl] = useState('');
    const [profile, setProfile] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdf, setPdf] = useState('');
    const [showHideImage, setShowHideImage] = useState('');
    const [showHidePDF, setShowHidePDF] = useState('');
    const [businessLicenseUrl, setBusinessLicenseUrl] = useState('');
    const [businessLicense, setBusinessLicense] = useState('');
    const [showHidebusinessLicense, setShowHidebusinessLicense] = useState('');
    const [allPlans, setAllPlans] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    // useEffect(() => {
    //     const script = document.createElement('script');

    //     script.src = "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCQ5YbkCZy6SjQjqOLo8S1qq4JshfWU5e4";
    //     script.async = true;

    //     document.body.appendChild(script);

    //     // return () => {
    //     //   document.body.removeChild(script);
    //     // }
    //   });

    useEffect(() => {
        window.scrollTo(0, 0)
        findAllServices()
        findAllPlans()
    }, []);

    const cancelEdit = () => {
        navigate("/provider");
    }

    const createProvider = async () => {
        let serviceIdNotPresent = true
        services.map((ele) => {
            if (!ele.serviceId) {
                serviceIdNotPresent = false
            }
        })
        if (!serviceIdNotPresent) {
            console.log("Please add service")
            return;
        }
        let formData = new FormData()
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("firstName", firstName)
        formData.append("lastName", lastName)
        formData.append("password", password)
        formData.append("createdAt", new Date().toISOString())
        formData.append("updatedAt", new Date().toISOString())
        formData.append("isActive", active)
        formData.append("isVerified", verify)
        formData.append("cancellationPolicy", cancellationPolicy)
        formData.append("isAvailable", isAvailable)
        formData.append("location", location.label ? location.label : "")
        formData.append("place_id", location?.value?.place_id ? location?.value?.place_id : "")
        formData.append("plan", plan)
        formData.append("userType", "provider")
        formData.append("services", JSON.stringify(services))
        formData.append("isApproved", isApproved)
        // formData.append("businessLicense", businessLicense)
        // formData.append("passportOrLicense", pdf)
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
        console.log(formData)
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/create`, {
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
                setProfileUrl(reader.result)
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
            let imageName = profile[0].name
            if (reg1.test(imageName) || reg2.test(imageName) || reg3.test(imageName)) {
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
        // setShowHidePDF(data)
        if (data) {
            let reg1 = /.jpg/ig;
            let reg2 = /.jpeg/ig;
            let reg3 = /.png/ig;
            let imageName = pdf[0].name
            if (reg1.test(imageName) || reg2.test(imageName) || reg3.test(imageName)) {
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
        // setShowHidebusinessLicense(data)
        if (data) {
            let reg1 = /.jpg/ig;
            let reg2 = /.jpeg/ig;
            let reg3 = /.png/ig;
            let imageName = businessLicense[0].name
            if (reg1.test(imageName) || reg2.test(imageName) || reg3.test(imageName)) {
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

    const addServices = () => {
        let data = services
        data.push({ serviceId: "", rate: "", })
        setServices([...data])
    }
    const onServicePriceChange = (id, i) => {
        let data = services
        data[i].rate = id
        setServices([...data])
    }
    const onServiceTypeChange = (id, i) => {
        let data = services
        data[i].serviceId = id
        setServices([...data])
    }
    const removeServices = (index) => {
        let data = services
        let data1 = []
        for (let i = 0; i < data.length; i++) {
            if (i != index) {
                data1.push(services[i])
            }
        }
        setServices([...data1])
    }

    const changeLocation = (place) => {
        // fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${place}&radius=500&key=AIzaSyCQ5YbkCZy6SjQjqOLo8S1qq4JshfWU5e4`)
        // .then((data) => data.JSON())
        // .then((data) => {
        //     console.log(data)
        // })
        let box = document.getElementById("location");
        // new google.maps.places.Autocomplete(box);
        // console.log(location)
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className=" w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>
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
                            label="Last Name*"
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
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Phone */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Phone* (10 digits)"
                            placeholder="1234567890"
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {/* Password */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Password* (minimum 6 characters)"
                            placeholder="*****"
                            id="password"
                            type="password"
                            autoComplete="off"
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Plan */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Plan*
                            </label>
                            <select name='services' id='services' onChange={(e) => setPlan(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`}>
                                <option value="">Select plan</option>
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
                                <option value="">Select a policy</option>
                                <option value="48">48 hours</option>
                                <option value="12">12 hours</option>
                                <option value="0">Any time</option>
                            </select>
                        </div>

                        {/* Location */}
                        {/* <TextareaField
                            extra="mb-3 w-80 mr-5"
                            label="Location"
                            placeholder="Location"
                            id="location"
                            disabled={false}
                            rows={3}
                            cols={20}
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value) 
                                changeLocation(e.target.value)
                            }
                            }
                        /> */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor="location" className="ml-3 mb-2 text-sm font-bold text-navy-700 dark:text-white">
                                Location
                            </label>
                            {/* <textarea name="location" placeholder="Location" id="location" cols="30" rows="3" value={location} onChange={(e) => {
                                setLocation(e.target.value) 
                                changeLocation(e.target.value)
                            }} className={`shadow-md shadow-[#a79cff] flex w-full items-center justify-center rounded-xl border text-neutral-900 dark:text-white bg-white/0 pl-3 pt-3 text-sm outline-none border-gray-200 dark:!border-white/10`} maxLength={140} ></textarea> */}
                            <GooglePlacesAutocomplete
                                apiKey="AIzaSyANMvigbXVdt5GfWwWMzNBF8xsCRP5rfO8"
                                selectProps={{
                                    location,
                                    onChange: setLocation,
                                }}
                            />
                        </div>

                        {/* Select Image  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Select Profile Pic
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onFileSelect(e)} type="file" name="profilePic" accept="jpeg, jpg, png" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(profileUrl)}>Preview</button> */}
                            </div>
                        </div>
                        {/* Select Passport  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Select Passport
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onPDFFileSelect(e)} type="file" name="passportOrLicense" accept="pdf" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewPDF(pdfUrl)}>Preview</button> */}
                            </div>
                        </div>
                        {/* Select Business License  */}
                        <div className="mb-3 w-80 mr-5">
                            <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Select Business License
                            </label>
                            <div className="flex flex-row">
                                <input onChange={e => onBusinessLicenseFileSelect(e)} name="businessLicense" type="file" accept="pdf" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                                {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewbusinessLicense(businessLicenseUrl)}>Preview</button> */}
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

                        {/* Verify Status  */}
                        <div className="w-80 mr-5">
                            <SwitchField
                                id="verify"
                                label="Verify Status"
                                desc=""
                                value={verify}
                                onChange={(e) => setVerify(e.target.checked)}
                            />
                        </div>

                        {/* Available Status  */}
                        <div className="w-80 mr-5">
                            <SwitchField
                                id="isAvailable"
                                label="Available Status"
                                desc=""
                                value={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                            />
                        </div>

                    </div>
                    <div className="flex flex-wrap mt-6">
                        {/* Approval Status  */}
                        <div className="w-80 mr-5">
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
                            <label htmlFor='services' className={`font-bold text-lg text-navy-700 dark:text-white ml-1.5`}>
                                Services
                                <button className="btn btn-primary ml-2 py-[4px]" onClick={addServices}>Add Service</button>
                            </label>
                            {
                                services.map((ele, index) => {
                                    return (
                                        <div className="flex flex-row">
                                            <select name='services' id='services' onChange={(e) => onServiceTypeChange(e.target.value, index)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`}>
                                                <option value="">Select service</option>
                                                {
                                                    allServices.map((ele) => <option key={ele._id} value={ele._id}>{ele.name}</option>)
                                                }
                                            </select>
                                            <input type="number" placeholder="$ Price" className={`shadow-md shadow-[#a79cff] mt-2 ml-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} onChange={(e) => onServicePriceChange(e.target.value, index)} />
                                            {
                                                services.length > 1 &&
                                                <button className="linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[4px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200" onClick={() => removeServices(index)}>Delete</button>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="flex align-middle justify-center">
                        <div className="flex flex-row w-80">
                            <button onClick={createProvider} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!firstName || !lastName || !email || !phone || phone.length < 10 || !password || password.length < 5 || !plan || !profile || !pdf || !businessLicense) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!firstName || !lastName || !email || !phone || phone.length < 10 || !password || password.length < 5 || !plan || !profile || !pdf || !businessLicense}>{isLoading ? 'Saving...' : 'Submit'}</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/provider">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            {
                (showHideImage || showHidePDF || showHidebusinessLicense)
                &&
                <div style={{ backgroundColor: "rgb(234 234 234 / 70%)" }} className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                    <div style={{ backgroundColor: "#fff" }} className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] border border-gray-400 p-8 rounded-[8px] block">
                        <div className="mt-10 flex flex-col h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            {showHideImage &&
                                <>
                                    <img src={showHideImage} alt="img" style={{ height: "400px", width: "auto" }} />
                                    <div className="flex flex-row mt-4">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadImage}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewImage('')}>Cancel</button>
                                    </div>
                                </>
                            }
                            {showHidePDF &&
                                <>
                                    <img src={showHidePDF} alt="img" style={{ height: "400px", width: "auto" }} />
                                    {/* <iframe src={showHidePDF}
                                        height="500">
                                    </iframe> */}
                                    <div className="flex flex-row mt-4">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadPdf}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewPDF('')}>Cancel</button>
                                    </div>
                                </>
                            }
                            {showHidebusinessLicense &&
                                <>
                                    <img src={showHidebusinessLicense} alt="img" style={{ height: "400px", width: "auto" }} />
                                    {/* <iframe src={showHidebusinessLicense}
                                        height="500">
                                    </iframe> */}
                                    <div className="flex flex-row mt-4">
                                        <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={downloadBusinessLicense}>Download</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded" onClick={() => privewbusinessLicense('')}>Cancel</button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            }
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

export default ProviderCreate;