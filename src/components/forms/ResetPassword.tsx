import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { account } from "@/lib/appwrite/config";

const ResetPassword = () => {
  const [userEmail, setUserEmail] = useState("");

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
    <div className="container-xl p-3 my-5 border">
      <h2 className="text-center"> Password Recovery</h2>
      <form className="container">
        <div className="mb-3">
          <label className="form-label">
            Enter your email
          </label>
          <input
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
            type="email"
            name="email"
            required
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={(e) => forgetPassword(e)}
        >
          Reset password
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
          pauseOnHover
        />
    </div>
  );
};

export default ResetPassword;
