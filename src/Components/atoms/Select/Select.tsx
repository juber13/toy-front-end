import React from "react";

interface SelectProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
  onChange: (selectedValue: string) => void;
}

const Select: React.FC<SelectProps> = ({ options, defaultValue, onChange }) => {
  return (
    <div className="flex items-center">
      <select
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
