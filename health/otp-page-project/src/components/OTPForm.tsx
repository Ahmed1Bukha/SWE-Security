import React, { useState } from 'react';
import OTPInput from './OTPInput';

const OTPForm = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    setOtp(newOtp);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length < 6) {
      setError('Please enter a complete OTP.');
      return;
    }

    // Add OTP validation logic here
    console.log('OTP Submitted:', otpString);
  };

  return (
    <form onSubmit={handleSubmit} className="otp-form">
      <div className="otp-inputs">
        {otp.map((value, index) => (
          <OTPInput
            key={index}
            index={index}
            value={value}
            onChange={handleChange}
            error={error}
          />
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">Submit OTP</button>
    </form>
  );
};

export default OTPForm;