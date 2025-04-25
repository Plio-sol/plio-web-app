import styled from 'styled-components';

export const IconBarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0; /* Or height: 100vh; */
    width: 65px; /* Width of the icon bar */
    background-color: #0a192f; /* Match app background or choose a subtle variant */
    border-right: 1px solid rgba(100, 116, 139, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px; /* Adjust top padding for logo */
    gap: 25px; /* Space between icons */
    z-index: 1000; /* Ensure it's above main content */
`;

export const Logo = styled.img`
    max-width: 45px; 
    height: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    cursor: pointer; 
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.05); // Slight grow on hover
    }
`;
// --- END MOVED ---

export const IconButton = styled.button`
    background: none;
    border: none;
    color: #a8b2d1; /* Default icon color */
    font-size: 1.6em; /* Size of the icons */
    padding: 10px;
    cursor: pointer;
    border-radius: 8px; /* Slightly rounded hover effect */
    transition: color 0.2s ease, background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px; /* Button size */
    height: 44px; /* Button size */

    &:hover {
        color: #ffffff; /* Brighter icon on hover */
        background-color: rgba(58, 80, 107, 0.7); /* Subtle background on hover */
    }

    &:active {
        transform: scale(0.95);
    }
`;