import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";

const ServiceEdit = () => {
    // get the id from the url which is in form of /service/edit?id=1

    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [allServices, setAllServices] = useState([]);
    const [parent, setParent] = useState('');
    const [oldServiceData, setOldServiceData] = useState({});
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [showHideImage, setShowHideImage] = useState('');
    const [totalServiceLinked, setTotalServiceLinked] = useState(0);
    const [jobType, setJobType] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        loadData()
        loadServices()
    }, []);

    const loadData = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/service/findById`, {
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
                setOldServiceData(res)
                setName(res.name)
                setDescription(res.description.length == 1 ? res.description[0].split(",").join("\n") : res.description.join("\n"))
                setParent(res.parent)
                setIsActive(res.isActive)
                setImage(res.image)
                setJobType(res.jobType)
                // let imageArr = res.image.map((ele) => {
                //     return process.env.REACT_APP_API_URL + "/" + ele
                // })
                // console.log(imageArr)
                setImageUrl(process.env.REACT_APP_API_URL + "/" + res.image)
            })
    }

    const cancelEdit = () => {
        navigate("/service/default");
    }

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
                pageNumber: 1,
                pageSize: 10000,
                sortField: '',
                sortOrder: "",
                search: ""
            })
        }).then(resp => resp.json())
            .then((res) => {
                let ParentService = res.services.filter((ele) => {
                    if (!ele.parent) {
                        return ele
                    }
                })
                // console.log(ParentService)
                setAllServices(ParentService);
                setIsLoading(false);
            })
    }

    const editService = async () => {
        if (isActive) {
            updateItem()
            return;
        }
        const token = localStorage.getItem('LuminixLoginToken');
        let data = {
            _id: oldServiceData._id
        }
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-provider/findByserviceId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                if (res.length > 0) {
                    setTotalServiceLinked(res.length)
                } else {
                    setTotalServiceLinked(0)
                }
                // cancelEdit()
            })
    }

    const updateItem = async () => {
        let payload = {
            ...oldServiceData,
            name,
            parent,
            isActive,
            description: description.split(/[,.?\n]/),
            image,
            jobType
        }
        let formData = new FormData()
        formData.append("_id", payload._id)
        formData.append("name", name)
        if(parent) {
            formData.append("parent", parent)
        }
        formData.append("isActive", isActive)
        // formData.append("jobType", jobType)
        formData.append("description", description.split(/[,.?\n]/))

        // console.log(payload)
        const token = localStorage.getItem('LuminixLoginToken');
        let data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        }
        let url = `${process.env.REACT_APP_API_URL}/api/service/update`
        if (`${process.env.REACT_APP_API_URL}/${image}` !== imageUrl) {
            url = `${process.env.REACT_APP_API_URL}/api/service/updateWithImage`
            for (let i = 0; i < image.length; i++) {
                formData.append("image", image[i])
            }
            data = {
                method: 'POST',
                // 'Content-Type': 'application/json',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }
        }

        setIsLoading(true);
        let results = await fetch(url, data)
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                cancelEdit()
            })
    }

    const onImagaeSelect = (event) => {
        console.log(event.target.files)
        setImage(event.target.files)


        // if (event.target.files && event.target.files.length) {
            const file = event.target.files[0]
            // console.log(file[0])
        //     let arr = []
        //     for (let i = 0; i < file.length; i++) {
                const reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = (e) => {
                    // arr.push(reader.result)
                    // console.log(reader.result)
                    setImageUrl(reader.result)
                }
            // }
        // }
    }

    const privewImage = (data) => {
        // setShowHideImage(data)
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

    const downloadImage = () => {
        console.log(showHideImage)
        var aTag = document.createElement("a")
        aTag.href = showHideImage
        aTag.download = "image.jpg";

        document.body.appendChild(aTag);
        aTag.click();

        document.body.removeChild(aTag);
    }

    const cancelUpdate = () => {
        let res = oldServiceData
        setName(res.name)
        setDescription(res.description.length == 1 ? res.description[0].split(",").join("\n") : res.description.join("\n"))
        setParent(res.parent)
        setIsActive(res.isActive)
        setImage(res.image)
        setTotalServiceLinked(0)
    }

    return (
        <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
            <div className="w-full max-w-full flex-col items-center xl:max-w-[420px] border border-gray-400 p-8 rounded-[8px] block">
                <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                    Update Data
                </p>

                {
                    oldServiceData.parent &&
                    <div className="mb-3">
                        <label htmlFor='category' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                            Select Category
                        </label>
                        <select name='category' id='category' onChange={(e) => setParent(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} value={parent}>
                            <option value="">Please Select</option>
                            {
                                allServices.map((ele) => <option key={ele._id} value={ele._id}>{ele.name}</option>)
                            }
                        </select>
                    </div>
                }

                {
                    oldServiceData.name &&
                    <>
                        {/* Enter Category Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-full"
                            label="Enter Category Name*"
                            placeholder="Enter Category Name"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </>
                }

                {/* description */}
                <TextareaField
                    label='Description*'
                    id='description'
                    extra='mb-3'
                    placeholder='Description'
                    cols={20}
                    rows={2}
                    state=''
                    disabled={false}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Job Type  */}
                {/* <div>
                    <label htmlFor='categoryType' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                        Job Type
                    </label>
                    <select name='categoryType' id='categoryType' onChange={(e) => setJobType(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none w-full mb-3`} value={jobType}>
                        <option value="">Please Select</option>
                        <option value="services">
                            Services
                        </option>
                        <option value="moving">
                            Home moving
                        </option>
                        <option value="delivery">
                            Delivery
                        </option>
                    </select>
                </div> */}

                {/* Active Status  */}
                <div className=" w-full">
                    <SwitchField
                        id="active"
                        label="Active Status"
                        desc=""
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                </div>

                {/* Select Image  */}
                <div className="mb-3">
                    <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                        Select Image
                    </label>
                    <div className="flex flex-row">
                        <input onChange={e => onImagaeSelect(e)} name="image" type="file" accept="jpeg, jpg, png" placeholder="Select File" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                        <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(imageUrl)}>Preview</button>
                    </div>
                </div>

                <div className="flex align-middle justify-center">
                    <div className="flex flex-row w-full">
                        <button onClick={editService} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!name || !description || (oldServiceData.parent && !parent)) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!name || !description || (oldServiceData.parent && !parent)}>Submit</button>
                        <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/service">Cancel</Link></button>
                    </div>
                </div>

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
                {totalServiceLinked > 0 &&
                    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50">
                        <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] p-8 rounded-[8px] block bg-white dark:bg-navy-800">
                            {/* <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                                Are you sure
                            </h4> */}
                            <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                                {totalServiceLinked} Providers are using this service. Are you sure you want to deactivate it?
                            </h4>
                            <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                                <button className="mr-5 w-20 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={updateItem}>Yes</button>
                                <button className="bg-red-500 w-20 hover:bg-red-600 text-white p-2 rounded" onClick={() => cancelUpdate()}>No</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ServiceEdit;