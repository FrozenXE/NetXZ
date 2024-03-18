import { account } from "@/lib/appwrite/config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    newPassword: "",
    repeatedPassword: "",
  });

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId")!;
    const secret = urlParams.get("secret")!;

    if (password.newPassword === password.repeatedPassword) {
      try {
        await account.updateRecovery(
          userId,
          secret,
          password.newPassword,
          password.repeatedPassword
        );
        toast.success('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        toast.error('An error occurred while updating password');
      }
    } else {
      toast.error('Both new password and the repeated password should be same');
    }
    navigate("/sign-in"); 
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
    <div className="flex w-3/4 flex-col items-center gap-5 justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 max-sm:w-5/">
      <div className="w-full p-6 border-2 bg-gray-900 border-slate-600 rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-white dark:border-white sm:p-8 ">
        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-300 md:text-2xl dark:text-white">
          Change Password
        </h2>
        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" onSubmit={changePassword}>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300 dark:text-white">New Password</label>
            <input 
            placeholder="••••••••" 
            className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" 
            required
                type="password"
                name="password"
                value={password.newPassword}
                onChange={(e) => setPassword({
                  ...password,
                  newPassword: e.target.value,
                })}
                id="newPassword" />
            </div>
          <div>
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Confirm password</label>
            <input 
            placeholder="••••••••" 
            className="py-3 px-4 block w-full border-2 border-gray-600 bg-transparent rounded-md text-sm focus:gray-400 focus:gray-400 shadow-sm" 

            required
            type="password"
            name="password"
            value={password.repeatedPassword}
            onChange={(e) => setPassword({
              ...password,
              repeatedPassword: e.target.value,
            })}
            id="repeatedPassword"/>
            </div>
          <button 
          type="submit" 
          className="py-3 px-4  w-full items-center gap-2 rounded-md border border-transparent font-semibold bg-slate-800 hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 text-gray-300">
            Reset passwod
            </button>
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
          pauseOnHover />
      </div>
    </div>
    </>
  );
};

export default CreatePassword;
