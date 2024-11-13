import { FC, ChangeEvent } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label?: string;
  className?: string;
}

const Input: FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name = '',
  label = '',
  className = '',
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        className="outline-none border-black border rounded-lg px-4 py-3 w-full"
      />
    </div>
  );
};

export default Input;
