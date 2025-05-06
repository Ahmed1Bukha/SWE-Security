import React from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, error }) => {
  return (
    <div className="otp-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input ${error ? 'input-error' : ''}`}
        maxLength={1}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default OTPInput;