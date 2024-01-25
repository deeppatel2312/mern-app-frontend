// Custom components
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";

function DropdownSearch(props) {
  const { label, id, extra, type, placeholder, autoComplete, variant, value, onClick, state, disabled, maxlength, api, extrapayload, resultType } = props;

  const [showHideDropdown, setShowHideDropdown] = useState(false)
  const [dropdownList, setDropdownList] = useState([])
  const [searchValue, setSearchValue] = useState("")

  const getAllResult = (inputValue) => {
    if (inputValue.length < 3) {
      setDropdownList([])
      return;
    }
    const token = localStorage.getItem('LuminixLoginToken');
    let payload = {
      pageNumber: 1,
      pageSize: 1000000000,
      sortField: "createdAt",
      sortOrder: "desc",
      search: inputValue
    }
    for (let key in extrapayload) {
      payload[key] = extrapayload[key]
    }
    fetch(`${process.env.REACT_APP_API_URL}${api}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())
      .then((res) => {
        setDropdownList(res[resultType])
      }).catch((err) => {
        console.log(err)
        return []
      })
  }

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
          }`}
      >
        {label}
      </label>
      <div className="flex flex-row justify-center items-center">
        <input
          autoComplete={autoComplete}
          disabled={disabled}
          type={type}
          id={id}
          placeholder={placeholder}
          value={searchValue}
          maxLength={maxlength}
          onChange={(e) => {
            setSearchValue(e.target.value)
            getAllResult(e.target.value)
          }}
          onFocus={() => setShowHideDropdown(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowHideDropdown(false)
              setDropdownList([])
            }, 400);
          }}
          className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : state === "success"
                ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
                : "border-gray-200 dark:!border-white/10 dark:text-white"
            }`}
        />
        <div className="shadow-md shadow-[#a79cff] mt-2 flex h-12 ml-2 items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none cursor-pointer">
          <BsChevronDown className="h-3 w-3" onClick={() => setShowHideDropdown(!showHideDropdown)} />
        </div>
      </div>
      {
        showHideDropdown &&
        <div className="absolute w-80 z-10 flex bg-[#f4f7ff] flex-col shadow-md shadow-[#a79cff] mt-2 h-auto text-neutral-900 dark:text-white rounded-xl border bg-white/0 p-3 text-sm outline-none overflow-y-scroll max-h-32">
          {
            dropdownList.map((ele) => {
              return (
                <p className="cursor-pointer" key={ele._id} onClick={() => {
                  onClick(ele._id)
                  setSearchValue(ele.firstName + " " + ele.lastName)
                  setShowHideDropdown(false)
                  setDropdownList([])
                }}>{ele.firstName} {ele.lastName}</p>
              )
            })
          }
        </div>
      }
    </div>
  );
}

export default DropdownSearch;
