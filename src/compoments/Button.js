import React from "react";

const Button = ({ isOpen, onClick }) => {
  return (
    <button
      className="btn-toggle"
      onClick={() => onClick((open) => onClick(!open))}
    >
      {isOpen ? "–" : "+"}
    </button>
  );
};

export default Button;
