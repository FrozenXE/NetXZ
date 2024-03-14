import { account } from "@/lib/appwrite/config";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePassword = () => {
  const [password, setPassword] = useState({
    newPassword: "",
    repeatedPassword: "",
  });

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

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
        // Password successfully updated
        toast.success('Password updated successfully');
      } catch (error) {
        // Error occurred while updating password
        console.error('Error updating password:', error);
        toast.error('An error occurred while updating password');
      }
    } else {
      // Passwords don't match
      toast.error('Both new password and the repeated password should be same');
    }
  };

  return (
    <div>
      <div className="container-xl p-3 my-5 border">
        <h2 className="text-center">Reset your password</h2>
        <form className="container" onSubmit={changePassword}>
          <div className="mb-3">
            <label className="form-label">Enter your new password:</label>
            <input
              required
              type="password"
              name="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                })
              }
              className="bg-black border !border-slate-300 active:border-slate-300"
              id="newPassword"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Repeat your new password:</label>
            <input
              required
              type="password"
              name="password"
              value={password.repeatedPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  repeatedPassword: e.target.value,
                })
              }
              className="bg-black border !border-slate-300 active:border-slate-300 !border-solid"
              id="repeatedPassword"
            />
          </div>
          <button className="btn btn-success" type="submit">
            Change Password
          </button>
        </form>
      </div>
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
  );
};

export default CreatePassword;
