// src/components/Icons/XIcon.tsx
import React from "react";

interface XIconProps {
  className?: string; // Allow passing className for potential styling overrides
}

const XIcon: React.FC<XIconProps> = ({ className }) => {
  return (
    <svg
      className={className} // Apply className if passed
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" // Good practice for decorative icons
    >
      <path
        d="M9.47 6.77 15.3 0h-1.4L8.85 5.88 4.81 0H.15l6.11 8.9L.15 16h1.38l5.35-6.21L11.14 16h4.67L9.47 6.77Zm-1.9 2.2-.61-.88-4.93-7.05h2.12l3.98 5.69.62.88 5.17 7.4h-2.13L7.58 8.97Z"
        fillRule="nonzero" // Use camelCase for JSX attribute
        fillOpacity="1"
        fill="currentColor" // Inherit color from parent CSS
        stroke="none"
      ></path>
    </svg>
  );
};

export default XIcon;
