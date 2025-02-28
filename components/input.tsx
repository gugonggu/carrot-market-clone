import { InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

const Input = ({
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        {...rest}
        name={name}
        className="w-full h-10 transition bg-transparent border-none rounded-md focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
      />
      {errors.map((error, index) => (
        <span key={index} className="font-medium text-red-500">
          {error}
        </span>
      ))}
    </div>
  );
};
export default Input;
