import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import SwitchField from "components/fields/SwitchField";

const TransactionView = () => {
    // get the id from the url which is in form of /transaction/edit?id=1

    const navigate = useNavigate();
    const [transactionId, setTransactionId] = useState(null);
    const [originalAmount, setAmount] = useState(null);
    const [commissionAmount, setCommission] = useState(null);
    const [finalAmount, setFinalAmount] = useState(null);
    const [userType, setUserType] = useState(null);
    const [transactionType, setTransactionType] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [personData, setPersonData] = useState({});
    const [fetchedData, setFetchedData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState(null);
    const [showHideDeleteBox, setShowHideDeleteBox] = useState(false)
    const [showHideDeleteBoxText, setShowHideDeleteBoxText] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
        loadTransaction()
    }, []);

    const transactionTypes = {
        'sub': 'Subscription',
        'job': 'Job',
        'payout': 'Payout'
    }

    const loadTransaction = async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        const token = localStorage.getItem('LuminixLoginToken');
        setIsLoading(true);
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/transaction/findTransactionById`, {
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
                setTransactionId(() => data.transactionId)
                setAmount(() => data.originalAmount)
                setCommission(() => data.commissionAmount)
                setFinalAmount(() => data.finalAmount)
                setUserType(() => data.userType)
                setTransactionType(() => data.transactionType)
                setMetadata(() => data.metadata)
                setPersonData(() => data.personId)
                setDate(() => data.date)
            })
            .catch((err) => {
                setShowHideDeleteBoxText("Something went wrong. Try refreshing the page.")
                setShowHideDeleteBox(true)
            })
    }

    return (
        <>
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-12 ml-1 font-bold text-xl text-gray-800 text-center dark:text-white">
                        Details
                    </p>

                    <div className="flex flex-wrap w-full">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table table-sm text-neutral-900">
                                <tbody>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <td>{transactionId}</td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>{new Date(date).toLocaleString()}</td>
                                    </tr>
                                    {originalAmount > 0 &&
                                        <tr>
                                            <th>Original Amount</th>
                                            <td>${originalAmount.toFixed(2)}</td>
                                        </tr>
                                    }
                                    {commissionAmount > 0 &&
                                        <tr>
                                            <th>Commission Amount</th>
                                            <td>${commissionAmount.toFixed(2)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <th>Final Amount</th>
                                        <td>${finalAmount && finalAmount.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>Person name</th>
                                        <td>{personData.firstName + " " + personData.lastName}</td>
                                    </tr>
                                    {transactionType !== 'payout' &&
                                        <tr>
                                            <th>User type</th>
                                            <td>{userType && userType.charAt(0).toUpperCase() + userType.slice(1)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <th>Transaction type</th>
                                        <td>{transactionTypes[transactionType]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showHideDeleteBox &&
                <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle bg-gray-400/50 dark:bg-navy-400/50 z-40">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] bg-white dark:bg-navy-800 p-8 rounded-[8px] block">
                        <h4 className="mb-2.5 text-lg font-bold text-center text-navy-700 dark:text-white">
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

export default TransactionView;