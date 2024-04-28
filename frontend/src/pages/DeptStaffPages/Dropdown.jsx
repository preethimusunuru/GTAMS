import React from "react";

const Dropdown = ({ options, value, handleChange, name }) => {
    // console.log(value)
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={handleChange}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
