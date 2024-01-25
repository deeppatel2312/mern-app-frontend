import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import SwitchField from "components/fields/SwitchField";

const UserCreate = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(true);
    const [verify, setVerify] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const cancelEdit = () => {
        navigate("/user");
    }

    const createUser = async () => {
        let payload = {
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            password: password,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: active,
            isVerified: verify,
            userType: "user"
        }
        console.log(payload)
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/create`, {
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
                if(res?.status == "failure") {
                    setErrorMessage(res.message)
                } else {
                    cancelEdit()
                }
            })
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>
                    <div className="flex justify-between flex-wrap">

                        {/* First Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
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
                            extra="mb-3 w-80 mr-4"
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
                            extra="mb-3 w-80 mr-4"
                            label="Email*"
                            placeholder="email@example.com"
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Phone */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Phone*"
                            placeholder="1234567890"
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {/* Password */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Password*"
                            placeholder="*****"
                            id="password"
                            type="password"
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Active Status  */}
                        <div className="w-80 mr-4">
                            <SwitchField
                                id="active"
                                label="Active Status"
                                desc=""
                                value={active}
                                onChange={(e) => setActive(e.target.checked)}
                            />
                        </div>

                        {/* Verify Status  */}
                        <div className="w-80 mr-4">
                            <SwitchField
                                id="verify"
                                label="Verify Status"
                                desc=""
                                value={verify}
                                onChange={(e) => setVerify(e.target.checked)}
                            />
                        </div>

                    </div>
                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={createUser} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!firstName || !lastName || !email || !phone || phone.length != 10 || !password) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!firstName || !lastName || !email || !phone || phone.length != 10 || !password}>Submit</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/user">Cancel</Link></button>
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

export default UserCreate;