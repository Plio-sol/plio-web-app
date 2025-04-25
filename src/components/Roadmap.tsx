import React, { FC } from "react";


const Roadmap: FC = ({
}) => (
  <div
    style={{
      backgroundColor: "rgba(23, 42, 69, 0.6)", // Semi-transparent dark blue
      backdropFilter: 'blur(5px)',
      padding: "40px 50px",
      borderRadius: "15px",
      textAlign: "center",
      maxWidth: "450px",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(100, 116, 139, 0.3)", // Subtle border
    }}
  >
    {/* Logo */}
    <img
      src={process.env.PUBLIC_URL + "/plio-logo.png"} // Correct path
      alt="Plio Logo"
      style={{
        maxWidth: "150px", // Adjust size as needed
        height: "auto",
        marginBottom: "30px", // Space below logo
      }}
    />

    <h2
      style={{
        color: "#ffffff", // White heading
        marginBottom: "30px",
        fontWeight: 600,
        fontSize: "1.8em",
      }}
    >
      Enter Access Code
    </h2>
  </div>
);

export default Roadmap;
