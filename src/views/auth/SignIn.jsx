import InputField from "components/fields/InputField";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoHorizontal from "assets/img/logos/logo-horizontal.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("LuminixLoginToken") && localStorage.getItem("LuminixLoginEmail")) {
      validateUser();
    }
  }, [])

  const validateUser = () => {
    let token = localStorage.getItem("LuminixLoginToken");
    let email = localStorage.getItem("LuminixLoginEmail");
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/validateUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(
        {
          email: `${email}`,
          token: `${token}`
        }
      ),
    }).then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.message == "Verified") {
          navigate("/admin/default");
        }
      })
  }

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            email: `${email}`,
            password: `${password}`
          }
        ),
      });
      const data = await response.json();
      localStorage.setItem("LuminixLoginToken", data.token);
      localStorage.setItem("LuminixLoginEmail", data.email);
      if (data.token) {
        navigate("/admin/default");
      } else {
        setShowError(true);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseError = () => {
    setShowError(false);
  };

  const buttonPress = (event) => {
    if (event.code === "Enter") {
      handleSignIn()
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-middle" onKeyUp={(e) => buttonPress(e)}>
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center xl:max-w-[420px] border border-gray-400 p-8 rounded-[8px] block">
        <img src={logoHorizontal} alt="Luminix logo" className="h-12 mb-2 mx-auto" />
        <p className="mb-8 ml-1 text-sm text-gray-700 text-center">
          Welcome to Admin!
        </p>
        {showError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
            <button className="absolute top-0 right-0 px-2 py-1" onClick={handleCloseError}>
              <span className="sr-only">Close</span>
              <span className="font-bold text-[#000000]">×</span>
            </button>
          </div>
        )}
        <h4 className="mb-2.5 text-4xl font-bold text-center text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600 text-center">
          Enter your email and password to sign in!
        </p>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="email@example.com"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="********"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<AiFillEyeInvisible className="h-6 w-6" />}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          {/* <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div> */}
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Forgot Password?
          </Link>
        </div>
        <button onClick={handleSignIn} className={`linear mt-2 w-full rounded-xl bg-brand-300 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-400 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${loading ? 'cursor-wait' : ''}`} disabled={loading}>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        {/* <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href=" "
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div> */}
      </div>
    </div>
  );
}
