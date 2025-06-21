"use client";

import "./CustomDatePicker.css";

import { CustomDatePickerProps } from "../types";

function CustomDatePicker({
  label,
  name,
  placeholder = "YYYY / MM / DD",
  value,
  onChange,
  disabled,
  className = "",
  error,
}: CustomDatePickerProps) {
  // Helper to safely get a date string in "YYYY-MM-DD" format
  const getDateString = (val: string | Date | null | undefined) => {
    if (!val) return "";
    if (typeof val === "string") {
      return val.length >= 10 ? val.substring(0, 10) : "";
    }
    const time = new Date(val).getTime();
    return !isNaN(time) ? new Date(val).toISOString().substring(0, 10) : "";
  };

  // Pass only the value string to onChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <label>
      <label htmlFor={name}>
        {label && (
          <label className="block mb-2 text-lg font-medium text-black text-right">
            {label}
          </label>
        )}
        <div className="flex items-center px-4 justify-center gap-1 border rounded-lg border-neutral-100 focus-within:border-blue-500 transition text-black">
          
          <input
            type="date"
            id={name}
            name={name}
            value={getDateString(value)}
            onChange={handleChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full p-2 text-lg border-none focus:border-none focus:outline-none text-black ${className} ${
              error ? "border-red-500 text-red-500" : ""
            }`}
          />
        </div>
        {error && <p className="mt-1 text-md text-red-500">{error}</p>}
      </label>
    </label>
  );
}

export default CustomDatePicker;
