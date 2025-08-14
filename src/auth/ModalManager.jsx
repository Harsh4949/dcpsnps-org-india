import { useState } from 'react';
import LoginModal from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

/**
 * ModalManager Component
 * 
 * This component is responsible for switching between different 
 * authentication-related modals:
 *   - Login modal
 *   - Register modal
 *   - ForgotPassword modal
 * 
 * Props:
 *  - onClose: callback to close the entire auth modal from parent
 */
const ModalManager = ({ onClose }) => {
 // Tracks the currently active modal: 'login' | 'register' | 'forgot
  const [activeModal, setActiveModal] = useState('login'); 

  // Helper to close both modal and parent state
  const handleClose = () => {
    setActiveModal('login'); //Reset for next open
    if (onClose) onClose();//// Notify parent to close modal wrapper
  };

  return (
    <>
     {/* Show Login Modal when active */}
      {activeModal === 'login' && (
        <LoginModal 
          onClose={handleClose}
          onSwitchToRegister={() => setActiveModal('register')}
          onSwitchToForgot={() => setActiveModal('forgot')}
        />
      )}

       {/* Show Register Modal when active */}
      {activeModal === 'register' && (
        <Register 
          onClose={handleClose}
          onSwitchToLogin={() => setActiveModal('login')}
        />
      )}

       {/* Show Forgot Password Modal when active */}
      {activeModal === 'forgot' && (
        <ForgotPassword 
          onClose={handleClose}
          onSwitchToLogin={() => setActiveModal('login')}
        />
      )}
    </>
  );
};

export default ModalManager;
