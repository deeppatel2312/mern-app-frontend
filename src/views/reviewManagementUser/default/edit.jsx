import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";

const ReviewUserEdit = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    const [reviewId, setReviewId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [active, setActive] = useState(false);
    const [fetchedData, setFetchedData] = useState({});
    const [userId, setUserId] = useState({});
    const [providerId, setProviderId] = useState({});
    const [jobId, setJobId] = useState({});
    const [serviceId, setServiceId] = useState({});
    const [userRating, setUserRating] = useState("");
    const [userReview, setUserReview] = useState("");
    const [providerRating, setProviderRating] = useState("");
    const [providerReview, setProviderReview] = useState("");
    const [isReported, setIsReported] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        setReviewId(id)
        loadReview()
    }, []);

    const loadReview = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getRatingReviewById`, {
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
                let data = res.data
                setIsLoading(false)
                setFetchedData(data)
                setActive(data.isActiveForUser)
                setUserId(data.userId)
                setProviderId(data.providerId)
                setJobId(data.jobId)
                setServiceId(data.serviceId)
                setIsReported(data.isReported)
                setUserRating(data.userRating)
                setUserReview(data.userReview)
                setProviderRating(data.providerRating)
                setProviderReview(data.providerReview)
            })
    }

    const cancelReview = () => {
        navigate("/review");
    }

    const editReview = async () => {
        let payload = {
            ...fetchedData,
            isActiveForUser: active,
            userId: userId._id,
            // providerId: providerId._id,
            jobId: jobId._id,
            serviceId: serviceId._id,
            isReported,
            // userRating,
            // userReview,
            providerRating,
            providerReview,
            updatedAt: new Date().toISOString(),
        }
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateRatingReview`, {
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
                cancelReview()
            })
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Update Data
                    </p>

                    <div className="flex flex-wrap">
                        {/* User Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="User Name"
                            placeholder="User Name"
                            id="userName"
                            type="text"
                            value={userId.firstName + " " + userId.lastName}
                            disabled={true}
                            onChange={(e) => ""}
                        />

                        {/* Provider Name */}
                        {/* <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Provider Name"
                            placeholder="Provider Name"
                            id="providerName"
                            type="text"
                            value={providerId.firstName + " " + providerId.lastName}
                            disabled={true}
                            onChange={(e) => ""}
                        /> */}

                        {/* Service Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Service Name"
                            placeholder="Service Name"
                            id="serviceName"
                            type="text"
                            value={serviceId.name}
                            disabled={true}
                            onChange={(e) => ""}
                        />

                        {/* Job Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Job ID"
                            placeholder="Job ID"
                            id="jobName"
                            type="text"
                            value={jobId.jobId}
                            disabled={true}
                            onChange={(e) => ""}
                        />

                        {/* Rating by provider */}
                        {/* <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Rating by user to provider"
                            placeholder="Rating by provider to user"
                            id="userRating"
                            type="number"
                            value={userRating}
                            onChange={(e) => setUserRating(e.target.value)}
                        /> */}

                        {/* Review by provider */}
                        {/* <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Review by user to provider"
                            placeholder="Review by provider to user"
                            id="userReview"
                            type="text"
                            value={userReview}
                            onChange={(e) => setUserReview(e.target.value)}
                        /> */}

                        {/* Rating by user */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Rating by user to provider"
                            placeholder="Rating by user to provider"
                            id="providerRating"
                            type="number"
                            value={providerRating}
                            onChange={(e) => setProviderRating(e.target.value)}
                        />

                        {/* Review by user */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="Review by user to provider"
                            placeholder="Review by user to provider"
                            id="ProviderReview"
                            type="text"
                            value={providerReview}
                            onChange={(e) => setProviderReview(e.target.value)}
                        />


                    </div>

                    <div className="flex flex-wrap my-6">


                        {/* Active Status  */}
                        <div className="w-80 mr-5 mt-5">
                            <SwitchField
                                id="active"
                                label="Active Status"
                                desc=""
                                value={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        </div>

                        {/* Is Reported  */}
                        <div className="w-80 mr-5 mt-5">
                            <SwitchField
                                id="isReported"
                                label="Is Reported"
                                desc=""
                                value={isReported}
                                onChange={(e) => setIsReported(e.target.checked)}
                            />
                        </div>

                    </div>

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={editReview} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={false}>Submit</button>
                            <button onClick={cancelReview} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/review">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewUserEdit;