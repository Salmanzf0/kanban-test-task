import React from "react";
import { FaBeer } from "react-icons/fa";

const ButtonTag = ({ title, onClick, className, Icon }) => {
  ButtonTag.defaultProps = {
    title: "Click me",
    className: "",
    onClick: () => {},
    Icon: FaBeer, // Default icon
  };

  return (
    <>
      <button
        className={`bg-red-600 text-white font-[400] h-[30px] px-3 flex items-center rounded-2xl ${className}`}
        onClick={onClick}
      >
          {Icon && <Icon className="mr-1 text-[16px]" />}
        {title}
      </button>
    </>
  );
};

export default ButtonTag;
