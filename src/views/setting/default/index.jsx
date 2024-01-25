import InputField from "components/fields/InputField";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const SettingIndex = () => {
    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [range, setRange] = useState("");
    const [taxPercentage, setTaxPercentage] = useState("");
    const [commissionPercentage, setCommissionPercentage] = useState("");
    const [emailFrom, setEmailFrom] = useState("");
    const [smtpService, setSmtpService] = useState("");
    const [smtpPort, setSmtpPort] = useState("");
    const [smtpSecure, setSmtpSecure] = useState("");
    const [id, setId] = useState("");
    const [gmailAppPassword, setGmailAppPassword] = useState("");
    const [gmailUserName, setGmailUserName] = useState("");
    const [showHideDeleteBox, setShowHideDeleteBox] = useState(false)
    const [showHideDeleteBoxText, setShowHideDeleteBoxText] = useState('')



    useEffect(() => {
        getSetting()
    }, [])

    const getSetting = async () => {
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/getSettings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(resp => resp.json())
            .then((res) => {
                console.log(res[0])
                let data = res[0]
                setId(data._id)
                setRange(data.range)
                setTaxPercentage(data.taxPercentage)
                setCommissionPercentage(data.commissionPercentage)
                setEmailFrom(data.emailFrom)
                setSmtpService(data.smtpService)
                setSmtpPort(data.smtpPort)
                setSmtpSecure(data.smtpSecure)
                setGmailAppPassword(data.gmailAppPassword)
                setGmailUserName(data.gmailUsername)
            })
    }


    const updateSetting = async () => {
        setIsLoading(true);
        let payload = {
            _id: id,
            range,
            taxPercentage,
            commissionPercentage,
            emailFrom,
            smtpService,
            smtpPort,
            smtpSecure,
            gmailUsername: gmailUserName,
            gmailAppPassword
        }
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/admin-user/updateSetting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(resp => resp.json())
            .then((res) => {
                if (res.status == true) {
                    setIsLoading(false);
                    setShowHideDeleteBoxText("Settings Updated Successfully.")
                    setShowHideDeleteBox(true)
                }
            })
            .catch((err) => {
                setShowHideDeleteBoxText("Something went wrong. Try again.")
                setShowHideDeleteBox(true)
            })
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div>
                    <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                        <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                            Update Settings
                        </p>
                        {/* <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
                        Update Data
                    </h4> */}

                        <div className="flex flex-wrap">
                            {/* Range */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="Service Search Range (in kilometers)"
                                placeholder="Service Search Range"
                                id="range"
                                type="text"
                                value={range}
                                onChange={(e) => setRange(e.target.value)}
                            />

                            {/* Tax Percentage */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="VAT Percentage"
                                placeholder="VAT Percentage"
                                id="taxPercentage"
                                type="number"
                                min={0}
                                max={100}
                                value={taxPercentage}
                                onChange={(e) => setTaxPercentage(e.target.value)}
                            />

                            {/* Commission Percentage */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="Commission Percentage"
                                placeholder="Commission Percentage"
                                id="commissionPercentage"
                                type="number"
                                min={0}
                                max={100}
                                value={commissionPercentage}
                                onChange={(e) => setCommissionPercentage(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap">
                            {/* SMTP Service */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="SMTP Service"
                                placeholder="SMTP Service"
                                id="smtpService"
                                type="text"
                                value={smtpService}
                                onChange={(e) => setSmtpService(e.target.value)}
                            />

                            {/* SMTP Port */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="SMTP Port"
                                placeholder="SMTP Port"
                                id="smtpPort"
                                type="text"
                                value={smtpPort}
                                onChange={(e) => setSmtpPort(e.target.value)}
                            />

                            {/* SMTP Secure */}
                            <div className="mb-3 w-80 mr-5">
                                <label htmlFor='smtpSecure' className={`text-sm text-navy-700 dark:text-white ml-1.5 font-medium`}>
                                    SMTP Secure
                                </label>
                                <select name='smtpSecure' id='smtpSecure' value={smtpSecure}
                                    onChange={(e) => setSmtpSecure(e.target.value)} className={`shadow-md shadow-[#a79cff] mt-2 mr-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none`}>
                                    <option value="">Please Select</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            {/* Gmail Username */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="Gmail Username"
                                placeholder="Gmail Username"
                                id="gmailUserName"
                                type="text"
                                value={gmailUserName}
                                onChange={(e) => setGmailUserName(e.target.value)}
                            />

                            {/* Gmail App Password */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="Gmail App Password"
                                placeholder="Gmail App Password"
                                id="gmailAppPassword"
                                type="text"
                                value={gmailAppPassword}
                                onChange={(e) => setGmailAppPassword(e.target.value)}
                            />

                            {/* Email From */}
                            <InputField
                                variant="auth"
                                extra="mb-3 w-80 mr-5"
                                label="Email From"
                                placeholder="Email From"
                                id="emailFrom"
                                type="text"
                                value={emailFrom}
                                onChange={(e) => setEmailFrom(e.target.value)}
                            />
                        </div>

                        <br />
                        <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] p-2 mt-2 rounded-[8px] block bg-red-200 text-gray-800 text-sm">
                            <p className="text-center"><strong>CAUTION</strong> : Modifying critical settings may disrupt app functionality. Please ensure accurate values to avoid unintended consequences.</p>
                        </div>
                        <br />
                        <div className="flex align-middle justify-evenly">
                            <div className="flex flex-row w-80 justify-center">
                                <button
                                    onClick={updateSetting}
                                    className={`linear mt-2 w-1/2 rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''}  ${(false) ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    disabled={isLoading}>
                                    {!isLoading ? 'Update' : 'Loading...'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showHideDeleteBox &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50 z-40">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h4 className="mb-2.5 text-2xl font-bold text-center text-navy-700 dark:text-white">
                            {showHideDeleteBoxText}
                        </h4>
                        <div className="mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                            <button className="mr-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded" onClick={() => setShowHideDeleteBox(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default SettingIndex;