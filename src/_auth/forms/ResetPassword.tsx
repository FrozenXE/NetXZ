// Import necessary modules
import { useState } from 'react';
import { initiatePasswordRecovery, completePasswordRecovery } from '@/lib/appwrite/api';
import { useNavigate, useLocation } from 'react-router-dom';

// Define ResetPassword component
function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');
  const [step, setStep] = useState('initiate');
  const [error] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle initiating password reset
  const handleInitiatePasswordReset = async () => {
    try {
      await initiatePasswordRecovery(email);
      setSuccessMessage('Password reset email sent successfully. Check your inbox.');
      setStep('complete');
    } catch (error) {
      console.error(error);
    }
  };

  // Handle completing password reset
  const handleCompletePasswordReset = async () => {
    try {
      await completePasswordRecovery(userId, secret, newPassword);
      setSuccessMessage('Password reset successful. You can now log in with your new password.');
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (step === 'initiate') {
      handleInitiatePasswordReset();
    } else {
      handleCompletePasswordReset();
    }
  };

  // Redirect to sign-in if already logged in
  if (location.pathname === '/reset-password') {
    navigate('/');
  }

  return (
    <div>
      <h2>Password Reset</h2>
      {successMessage && <div>{successMessage}</div>}
      {!successMessage && (
        <form onSubmit={handleSubmit}>
          {step === 'initiate' ? (
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          ) : (
            <div>
              <label>New Password:</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <label>Confirm Password:</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <input type="hidden" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <input type="hidden" value={secret} onChange={(e) => setSecret(e.target.value)} />
            </div>
          )}
          {error && <div>{error}</div>}
          <button type="submit">{step === 'initiate' ? 'Initiate Password Reset' : 'Complete Password Reset'}</button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
