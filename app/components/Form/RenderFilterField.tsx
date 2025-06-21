"use client";
import CustomDatePicker from './DateFiled/CustomDatePicker';
import InputField from './InputField';
import SelectField from './SelectField';
import { RenderFilterFieldProps } from './types';

const RenderFilterField = ({ column, handleFilterChange, filters }: RenderFilterFieldProps) => {
  const name = column.key;
  const value = filters[name] || '';

  switch (column.filterType) {
    case 'text':
      return (
        <InputField
          key={name}
          name={name}
          label={column.title}
          type="text"
          placeholder={`ادخل ${column.title}`}
          clearable={true}
          value={value}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="mb-3"
        />
      );

    case 'select':
      return (
        <SelectField
          key={name}
          name={name}
          label={column.title}
          options={column.filterOptions || []}
          placeholder={`اختر ${column.title}`}
          clearable={true}
          value={value}
          onChange={(e) => handleFilterChange(name, e.target.value)}
          className="mb-3"
        />
      );

    case 'date':
      return (
        <CustomDatePicker
          key={name}
          name={name}
          label={column.title}
          value={value}
          onChange={(val: string) => handleFilterChange(name, val)}
        />
      );
    default:
      return null;
  }
};

export default RenderFilterField;
