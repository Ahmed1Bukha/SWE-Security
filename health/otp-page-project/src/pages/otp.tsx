import React from 'react';
import OTPForm from '../components/OTPForm';

const OTPPage = () => {
  return (
    <div className="otp-container">
      <h1 className="otp-title">Enter Your OTP</h1>
      <OTPForm />
    </div>
  );
};

export default OTPPage;