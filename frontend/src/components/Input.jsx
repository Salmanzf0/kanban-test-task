import React from "react";
import { CiSearch } from "react-icons/ci";
const Input = () => {
  return (
    <>
      <input
        type="text"
        placeholder="Search by issue name..."
        className="flex items-center relative w-[280px] h-[35px] rounded-md px-[40px] border border-gray-500"
      />

      <CiSearch className="absolute text-[20px] mt-2 m-1  text-[black]" />
    </>
  );
};

export default Input;
