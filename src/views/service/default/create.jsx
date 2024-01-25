import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";

const ServiceCreate = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [allServices, setAllServices] = useState([]);
    const [parent, setParent] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [jobType, setJobType] = useState('');
    const [isCreateSubCat, setIsCreateSubCat] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("parentId");
        if (id) {
            setCategoryType('subCategory')
            setParent(id)
            setIsCreateSubCat(true)
        }
        loadServices()
    }, []);

    const cancelEdit = () => {
        navigate("/service/default");
    }

    const createservice = async () => {
        let formData = new FormData()
        formData.append("name", name)
        if (parent) {
            formData.append("parent", parent)
        }
        formData.append("isActive", isActive)
        // formData.append("jobType", jobType)
        formData.append("description", description.split(/[,.?\n]/))
        for (let i = 0; i < image.length; i++) {
            formData.append("image", image[i])
        }
        console.log(...formData)
        // let payload = {
        //     name,
        //     isActive,
        //     description: description.split(/[,.?\n]/)
        // }
        // if (parent) {
        //     payload["parent"] = parent
        // }
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/service/create`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res)
                setIsLoading(false);
                cancelEdit()
            })
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
                console.log(ParentService)
                setAllServices(ParentService);
                setIsLoading(false);
            })
    }

    const onCategoryTypeChange = (e) => {
        setCategoryType(e.target.value)
        setName("")
        setParent("")
    }

    const onImagaeSelect = (event) => {
        console.log(event.target.files)
        setImage(event.target.files)
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[420px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>
                    {
                        !isCreateSubCat &&
                        <div>
                            <label htmlFor='categoryType' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                Category Type
                            </label>
                            <select name='categoryType' id='categoryType' onChange={(e) => onCategoryTypeChange(e)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none w-full mb-3`} value={categoryType}>
                                <option value="">Please Select</option>
                                <option value="category">
                                    <span className="tooltip tooltip-bottom" data-tip="Category">
                                        Category
                                    </span>
                                </option>
                                <option value="subCategory" title="sub category">
                                    <span className="tooltip tooltip-bottom" data-tip="Click to sort by name">
                                        Sub Category
                                    </span>
                                </option>
                            </select>
                        </div>
                    }
                    {
                        categoryType == 'category' &&
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
                    {
                        categoryType == 'subCategory' &&
                        <>
                            <div className="mb-3">
                                <label htmlFor='category' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    Select Category
                                </label>
                                <select disabled={isCreateSubCat} name='category' id='category' onChange={(e) => setParent(e.target.value)} value={parent} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none  ${isCreateSubCat && "cursor-not-allowed"}`}>
                                    <option value="">Please Select</option>
                                    {
                                        allServices.map((ele) => <option key={ele._id} value={ele._id}>{ele.name}</option>)
                                    }
                                </select>
                            </div>
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
                    {
                        categoryType &&
                        <div className=" w-full">
                            <SwitchField
                                id="active"
                                label="Active Status"
                                desc=""
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </div>
                    }

                    {/* Select Image  */}
                    <div className="mb-3">
                        <label htmlFor='services' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                            Select Image
                        </label>
                        <div className="flex flex-row">
                            <input onChange={e => onImagaeSelect(e)} type="file" accept="jpeg, jpg, png" placeholder="Select File" name="image" className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`} />
                            {/* <button className="btn btn-primary ml-2 mt-2" onClick={() => privewImage(imageUrl)}>Preview</button> */}
                        </div>
                    </div>

                    <div className="flex align-middle justify-center">
                        <div className="flex flex-row w-full">
                            <button onClick={createservice} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!name || !description || !image || (categoryType == 'subCategory' && !parent)) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={(!name || !description || !image || (categoryType == 'subCategory' && !parent))}>Submit</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/user">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServiceCreate;