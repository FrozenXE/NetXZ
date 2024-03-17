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
    <><div className="flex w-3/4 flex-col items-center gap-5 justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full p-6 bg-transparent rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-white dark:border-white sm:p-8">
        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
          Change Password
        </h2>
        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" onSubmit={changePassword}>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white dark:text-white">New Password</label>
            <input 
            placeholder="••••••••" 
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white dark:text-white">Confirm password</label>
            <input 
            placeholder="••••••••" 
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
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
