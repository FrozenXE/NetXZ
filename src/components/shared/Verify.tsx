import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateVerification } from "@/lib/appwrite/api"; 

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const secret = queryParams.get("secret");
  
    const verifyUser = async () => {
      try {
        if (userId && secret) {
          await updateVerification(userId, secret);
          navigate("/sign-in");
        } else {
          throw new Error("Missing userId or secret");
        }
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    verifyUser();
  }, [location.search, navigate]);
  

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while verifying
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if verification fails
  }

  return (
    <div>
      <h2>Email Sent for Verification</h2>
      <p>An email has been sent to you for account verification.</p>
      <p>Please check your inbox and follow the instructions to complete the verification process.</p>
    </div>
  );
};

export default Verify;
