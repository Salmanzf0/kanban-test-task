import React from "react";

// Example icon import (you can replace it with any icon library you are using)
import { FaBeer } from "react-icons/fa";

const Button = ({ text, className, onClick, Icon}) => {
  return (
    <button
      className={`px-4 py-2 rounded-md  text-black bg-transparent border border-[1px gray]  ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="mr-2 text-[16px]" />}
      {text}
    </button>
  );
};

// Setting default props
Button.defaultProps = {
  text: "Click me",
  className: "",
  onClick: () => {},
  Icon: FaBeer, // Default icon

};

export default Button;
