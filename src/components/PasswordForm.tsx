// src/components/PasswordForm.tsx
import React, { FC, FormEvent } from 'react';

// --- Password Form Component ---
interface PasswordFormProps {
    onSubmit: (event: FormEvent) => void;
    passwordInput: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    authError: string | null;
}

const PasswordForm: FC<PasswordFormProps> = ({
                                                 onSubmit,
                                                 passwordInput,
                                                 onChange,
                                                 authError
                                             }) => (
    <div style={{
        backgroundColor: 'rgba(23, 42, 69, 0.6)', // Semi-transparent dark blue
        // backdropFilter: 'blur(5px)', // Optional: Glassy effect (check browser support)
        padding: '40px 50px',
        borderRadius: '15px',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(100, 116, 139, 0.3)', // Subtle border
    }}>
        {/* Logo */}
        <img
            src={process.env.PUBLIC_URL + '/plio-logo.png'} // Correct path
            alt="Plio Logo"
            style={{
                maxWidth: '150px', // Adjust size as needed
                height: 'auto',
                marginBottom: '30px', // Space below logo
            }}
        />

        <h2 style={{
            color: '#ffffff', // White heading
            marginBottom: '30px',
            fontWeight: 600,
            fontSize: '1.8em',
        }}>
            Enter Access Code
        </h2>
        <form onSubmit={onSubmit}>
            <input
                type="password"
                value={passwordInput}
                onChange={onChange}
                placeholder="Password"
                style={{
                    display: 'block', // Make input take full width
                    width: '100%', // Full width within the container
                    padding: '14px 18px',
                    marginBottom: '25px', // Space before button
                    fontSize: '1.1em',
                    backgroundColor: 'rgba(10, 25, 47, 0.8)', // Darker input background
                    color: '#ccd6f6', // Light text color
                    border: '1px solid #4a5568', // Darker border
                    borderRadius: '8px',
                    boxSizing: 'border-box', // Include padding/border in width
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                }}
                autoFocus
                onFocus={(e) => e.target.style.borderColor = '#8A2BE2'} // Purple border on focus
                onBlur={(e) => e.target.style.borderColor = '#4a5568'} // Revert border on blur
            />
            <button
                type="submit"
                style={{
                    padding: '14px 35px',
                    fontSize: '1.1em',
                    cursor: 'pointer',
                    backgroundColor: '#8A2BE2', // Purple button
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    transition: 'background-color 0.3s ease, transform 0.1s ease',
                    width: '100%', // Make button full width
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} // Click effect
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a1fc2'} // Darker purple on hover
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#8A2BE2';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                Unlock
            </button>
            {authError && (
                <p style={{
                    color: '#ff7b7b', // Lighter red for dark background
                    marginTop: '20px',
                    fontSize: '0.95em',
                }}>
                    {authError}
                </p>
            )}
        </form>
    </div>
);

export default PasswordForm;