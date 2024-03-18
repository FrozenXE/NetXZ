import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { account } from "@/lib/appwrite/config";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");

  const handleLoginClick = () => {
    navigate('/sign-in');
  }
  const forgetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userEmail && userEmail.includes('@')) {
      await account.createRecovery(
        userEmail,
        "https://netxz.cfd/create-password"
      );

      toast.success(`Email has been sent!`);
    } else {
      toast.error(`Please enter your email!`);
    }
  };

  return (
    <>
      <div className="w-full">
      <img 
          className="w-1/5 start-0 flex m-auto max-md:w-1/5 max-sm:w-1/4"
            src="/assets/images/logo.svg" 
            alt="logo-text"
            width={150}
            height={40}
            />
      </div>
    <div className="mt-7 bg-gray-900 w-2/3 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-slate-600 max-sm:w-5/6" >
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-white dark:text-white">Forgot password?</h1>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-400">
            Remember your password? 
            <button className="text-blue-600 decoration-2 hover:underline font-medium" onClick={handleLoginClick}>
               Login here
            </button>
          </p>
        </div>

        <div className="mt-5">
          <form>
            <div className="grid gap-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email address</label>
                <div className="relative">
                  <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="youremail@email.com"
                  className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" 
                  required aria-describedby="email-error"
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                  } }
                  />
                  
                  </div>
                <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
              </div>
              <button 
              type="submit"
              onClick={(e) => forgetPassword(e)}
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-slate-800 text-white hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                Reset password
                </button>
            </div>
          </form>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
        </div>
      </div>
    </div><p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
        <a className="pr-3.5 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="https://github.com/frozenxe" target="_blank">
          <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View Github
        </a>
        <a className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="#">
          Contact us!
        </a>
      </p>
      
      </>
  );
};

export default ResetPassword;
