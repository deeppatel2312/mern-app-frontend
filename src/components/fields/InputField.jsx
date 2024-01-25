// Custom components
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function InputField(props) {
  const { label, id, extra, type, placeholder, autoComplete, variant, value, onChange, state, disabled, maxlength, max, min } =
    props;

  const [fieldType, setFieldType] = useState(type)
  const shoHidePassword = () => {
    // let field = document.getElementById("password").type
    // document.getElementById("password").type = field == "password" ? "text" : "password"
    setFieldType(fieldType == "password" ? "text" : "password")
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
          type={fieldType}
          id={id}
          placeholder={placeholder}
          value={value}
          max={max}
          min={min}
          maxLength={maxlength}
          onChange={onChange}
          className={`shadow-md shadow-[#a79cff] mt-2 flex h-12 w-full items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : state === "success"
                ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
                : "border-gray-200 dark:!border-white/10 dark:text-white"
            }`}
        />
        {
          type === "password" &&
          <>
            <div className="shadow-md shadow-[#a79cff] mt-2 flex h-12 ml-2 items-center text-neutral-900 dark:text-white justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none cursor-pointer">
              <button onClick={shoHidePassword}>
                {
                  fieldType == "password" ? <AiFillEye className="h-6 w-6" /> : <AiFillEyeInvisible className="h-6 w-6" />
                }
              </button>
            </div>
          </>
        }
      </div>
    </div>
  );
}

export default InputField;
