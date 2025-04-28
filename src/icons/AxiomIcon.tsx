
import React from "react";

interface AxiomIconProps {
  className?: string; // Allow passing className for potential styling overrides
}

const AxiomIcon: React.FC<AxiomIconProps> = ({ className }) => {
  return (
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_88_28967)">
          <path d="M24.1384 17.3876H11.8623L18.0001 7.00012L24.1384 17.3876Z" fill="#FCFCFC"/>
          <path d="M31 29.0003L5 29.0003L9.96764 20.5933L26.0324 20.5933L31 29.0003Z" fill="#FCFCFC"/>
        </g>
        <defs>
          <clipPath id="clip0_88_28967">
            <rect width="26" height="21" fill="white" transform="translate(5 7)"/>
          </clipPath>
        </defs>
      </svg>
  );
};

export default AxiomIcon;
