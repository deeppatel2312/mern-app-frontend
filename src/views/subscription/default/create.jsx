import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import SwitchField from "components/fields/SwitchField";
import TextareaField from "components/fields/TextField";

const SubscriptionCreate = () => {
    // get the id from the url which is in form of /user/edit?id=1

    const navigate = useNavigate();
    if (localStorage.getItem("LuminixLoginToken") === null) {
        navigate("/auth");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [duration, setDuration] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    const cancelEdit = () => {
        navigate("/subscription");
    }

    const createUser = async () => {
        let payload = {
            name,
            price,
            discount,
            duration,
            promoCode,
            description,
            isActive
        }
        console.log(payload)
        setIsLoading(true);
        const token = localStorage.getItem('LuminixLoginToken');
        let results = await fetch(`${process.env.REACT_APP_API_URL}/api/subscription/create`, {
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
            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle">
                <div className="w-full max-w-full flex-col items-center xl:max-w-[1120px] border border-gray-400 p-8 rounded-[8px] block">
                    <p className="mb-8 ml-1 text-sm text-gray-700 text-center dark:text-white">
                        Create Data
                    </p>
                    <div className="flex justify-between flex-wrap">

                        {/* Name */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Name*"
                            placeholder="Name"
                            id="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* Price */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Price (in dollars)"
                            placeholder="Price"
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        {/* Discount */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Discount Percentage"
                            placeholder="Discount"
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />

                        {/* Duration */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Duration (in days)"
                            placeholder="Duration"
                            id="duration"
                            type="number"
                            value={duration}
                            max={365}
                            onChange={(e) => setDuration(e.target.value)}
                        />

                        {/* PromoCode */}
                        <InputField
                            variant="auth"
                            extra="mb-3 w-80 mr-4"
                            label="Promo Code"
                            placeholder="promoCode"
                            id="promoCode"
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />

                        {/* description */}
                        <TextareaField
                            label='Benefits* (comma separated)'
                            id='description'
                            extra='mb-3 w-80 mr-4'
                            placeholder='Description'
                            cols={20}
                            rows={2}
                            state=''
                            disabled={false}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Active Status  */}
                        <div className="w-80 mr-4">
                            <SwitchField
                                id="active"
                                label="Active Status"
                                desc=""
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </div>

                    </div>
                    <div className="flex align-middle justify-evenly">
                        <div className="flex flex-row w-80">
                            <button onClick={createUser} className={`linear mr-1 mt-2 w-full rounded-xl bg-green-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200 ${isLoading ? 'cursor-wait' : ''} ${(!name || price <= 10 || discount <= 0 || !description || !promoCode) ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={!name || !description}>Submit</button>
                            <button onClick={cancelEdit} className={`linear ml-1 mt-2 w-full rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 ${isLoading ? 'cursor-wait' : ''}`}><Link to="/user">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubscriptionCreate;