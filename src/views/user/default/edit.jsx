import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";

const UserEdit = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fetchedData, setFetchedData] = useState({});
    const [active, setActive] = useState(false);
    const [approved, setIsApproved] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState("");
    const [verify, setVerify] = useState(false);
    const [otp, setOtp] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0)
        const id = new URLSearchParams(window.location.search).get("id");
        setUserId(id)
        loadUsers()
    }, []);

    const loadUsers = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/findById`, {
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
                setFetchedData(res)
                setIsLoading(false);
                setEmail(() => res.email)
                setFirstName(() => res.firstName)
                setLastName(() => res.lastName)
                setPhone(() => res.phone)
                setActive(() => res.isActive)
                setVerify(() => res.isVerified)
                setIsApproved(() => res.isApproved)
                setApprovalStatus(() => res.approvalStatus)
            })
    }

    const cancelEdit = () => {
        navigate("/user");
    }

    const editUser = async () => {
        let payload = {
            ...fetchedData,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            isActive: active,
            isVerified: verify,
            isApproved: approved,
            updatedAt: new Date().toISOString()
        }

        delete payload.approvalStatus;

        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/update`, {
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

                        {/* otp */}
                        {/* <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-5"
                            label="OTP"
                            placeholder="****"
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        /> */}
                    </div>

                    <div className="flex flex-wrap my-6">
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
                    </div>

                    <div className="flex flex-wrap my-6">
                        {/* Approval Status  */}
                        {approvalStatus == "pending" &&
                            <div className="w-96 mr-5">
                                <p className="text-sm text-blue-400">INFO: This user has requested to switch to provider profile</p>
                                <br />
                                <SwitchField
                                    id="active"
                                    label="Approval Status"
                                    desc=""
                                    value={approved}
                                    onChange={(e) => setIsApproved(e.target.checked)}
                                />
                            </div>
                        }
                    </div>

                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={editUser} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(!firstName || !lastName || !email || !phone || phone.length != 10) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!firstName || !lastName || !email || !phone || phone.length != 10}>Submit</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/user">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserEdit;